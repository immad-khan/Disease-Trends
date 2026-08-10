"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import districtData from "@/data/pakistan-districts.json";
import type { RegionKey } from "@/lib/types";
import { formatCompact } from "@/lib/regions";

/* ------------------------------------------------------------------ *
 *  Real Pakistan district boundaries (145 districts, 7 regions)
 *  Geometry credit: Ebtihaj Khan — Peshawar Civic Innovation Lab /
 *  Code for Pakistan.  Paths use only M/m/L/l/z, so a compact
 *  polygon parser replaces the DOM-bound three SVGLoader.
 * ------------------------------------------------------------------ */

interface RawGroup {
  region: string;
  shift: [number, number];
  borders: string[];
  districts: [string, string][];
}
const RAW = districtData as unknown as { w: number; h: number; groups: RawGroup[] };

type Ring = [number, number][];

/** Parse an SVG path limited to move/line/close into closed polygons. */
function parsePolygons(d: string): Ring[] {
  const tokens = d.match(/[MmLlZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  if (!tokens) return [];
  const rings: Ring[] = [];
  let cur: Ring | null = null;
  let cmd = "";
  let x = 0, y = 0, sx = 0, sy = 0;
  let i = 0;

  const push = () => {
    if (cur && cur.length > 2) rings.push(cur);
    cur = null;
  };

  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[MmLlZz]$/.test(t)) {
      cmd = t;
      i++;
      if (cmd === "z" || cmd === "Z") {
        push();
        x = sx; y = sy;
        cmd = "";
      }
      continue;
    }
    const a = parseFloat(tokens[i]);
    const b = parseFloat(tokens[i + 1]);
    i += 2;
    if (!Number.isFinite(a) || !Number.isFinite(b)) break;

    switch (cmd) {
      case "m":
        x += a; y += b; push(); cur = [[x, y]]; sx = x; sy = y; cmd = "l"; break;
      case "M":
        x = a; y = b; push(); cur = [[x, y]]; sx = x; sy = y; cmd = "L"; break;
      case "l":
        x += a; y += b; cur?.push([x, y]); break;
      case "L":
        x = a; y = b; cur?.push([x, y]); break;
      default:
        break;
    }
  }
  push();
  return rings;
}

function signedArea(r: Ring): number {
  let s = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    s += (r[j][0] - r[i][0]) * (r[j][1] + r[i][1]);
  }
  return s / 2;
}

interface BuiltRegion {
  region: RegionKey;
  solid: THREE.BufferGeometry;
  districtLines: THREE.BufferGeometry;
  borderLines: THREE.BufferGeometry;
  center: [number, number];
}

let CACHE: BuiltRegion[] | null = null;
const TARGET_WIDTH = 10.6;

function buildAll(): BuiltRegion[] {
  if (CACHE) return CACHE;

  // 1 ─ parse everything in svg space, applying each group's translate()
  const parsed = RAW.groups.map((g) => ({
    region: g.region as RegionKey,
    districts: g.districts.map(([, d]) =>
      parsePolygons(d).map((r) => r.map(([x, y]) => [x + g.shift[0], y + g.shift[1]] as [number, number]))
    ),
    borders: g.borders.map((d) =>
      parsePolygons(d).map((r) => r.map(([x, y]) => [x + g.shift[0], y + g.shift[1]] as [number, number]))
    ),
  }));

  // 2 ─ normalise to world units, flipping Y so south faces the camera
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const g of parsed)
    for (const poly of [...g.districts, ...g.borders])
      for (const ring of poly)
        for (const [x, y] of ring) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }

  const K = TARGET_WIDTH / (maxX - minX);
  const ox = ((minX + maxX) / 2) * K;
  const oy = -((minY + maxY) / 2) * K;
  const TX = (x: number) => x * K - ox;
  const TY = (y: number) => -y * K - oy;

  const out: BuiltRegion[] = [];

  for (const g of parsed) {
    const solids: THREE.BufferGeometry[] = [];
    const dSeg: number[] = [];
    const bSeg: number[] = [];

    for (const poly of g.districts) {
      for (const ring of poly) {
        const pts = ring.map(([x, y]) => new THREE.Vector2(TX(x), TY(y)));
        // consistent CCW winding keeps extruded normals facing up
        const flat: Ring = pts.map((p) => [p.x, p.y]);
        if (signedArea(flat) > 0) pts.reverse();

        const shape = new THREE.Shape(pts);
        solids.push(new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false }));

        for (let i = 0; i < pts.length; i++) {
          const a = pts[i], b = pts[(i + 1) % pts.length];
          dSeg.push(a.x, a.y, 1.002, b.x, b.y, 1.002);
        }
      }
    }

    for (const poly of g.borders) {
      for (const ring of poly) {
        for (let i = 0; i < ring.length - 1; i++) {
          bSeg.push(
            TX(ring[i][0]), TY(ring[i][1]), 1.008,
            TX(ring[i + 1][0]), TY(ring[i + 1][1]), 1.008
          );
        }
      }
    }

    const solid = mergeGeometries(solids);
    solid.computeBoundingBox();
    const bb = solid.boundingBox!;

    const dl = new THREE.BufferGeometry();
    dl.setAttribute("position", new THREE.Float32BufferAttribute(dSeg, 3));
    const bl = new THREE.BufferGeometry();
    bl.setAttribute("position", new THREE.Float32BufferAttribute(bSeg, 3));

    out.push({
      region: g.region,
      solid,
      districtLines: dl,
      borderLines: bl,
      center: [(bb.min.x + bb.max.x) / 2, (bb.min.y + bb.max.y) / 2],
    });
  }

  CACHE = out;
  return out;
}

function mergeGeometries(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const nor: number[] = [];
  for (const g of list) {
    const ng = g.index ? g.toNonIndexed() : g;
    const p = ng.getAttribute("position");
    const n = ng.getAttribute("normal");
    for (let i = 0; i < p.count; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i));
      if (n) nor.push(n.getX(i), n.getY(i), n.getZ(i));
    }
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  if (nor.length === pos.length) out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  else out.computeVertexNormals();
  return out;
}

/* ------------------------------ colour ------------------------------ */
const LOW = new THREE.Color("#e2f6fb");
const MID = new THREE.Color("#6fd0e4");
const HIGH = new THREE.Color("#0b7391");
const HOV = new THREE.Color("#05455a");

const heightFor = (v: number, max: number) =>
  max <= 0 ? 0.14 : 0.14 + Math.log1p((v / max) * (Math.E - 1)) * 2.35;

function colorFor(v: number, max: number, hovered: boolean) {
  const t = max <= 0 ? 0 : Math.log1p((v / max) * (Math.E - 1));
  const c = new THREE.Color();
  if (t < 0.5) c.lerpColors(LOW, MID, t * 2);
  else c.lerpColors(MID, HIGH, (t - 0.5) * 2);
  if (hovered) c.lerp(HOV, 0.4);
  return c;
}

/* --------------------------- one province --------------------------- */
function Province({
  built, value, max, hovered, onHover, onSelect, label, showDistricts,
}: {
  built: BuiltRegion;
  value: number;
  max: number;
  hovered: boolean;
  onHover: (k: RegionKey | null) => void;
  onSelect: (k: RegionKey) => void;
  label: { name: string; abbr: string };
  showDistricts: boolean;
}) {
  const grp = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const cur = useRef(0.14);

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0009, Math.min(dt, 0.05));
    const target = heightFor(value, max) + (hovered ? 0.2 : 0);
    cur.current = THREE.MathUtils.lerp(cur.current, target, k);
    if (grp.current) grp.current.scale.z = cur.current;
    if (mat.current) mat.current.color.lerp(colorFor(value, max, hovered), k);
  });

  return (
    <group
      ref={grp}
      onPointerOver={(e) => { e.stopPropagation(); onHover(built.region); document.body.style.cursor = "pointer"; }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); onSelect(built.region); }}
    >
      <mesh geometry={built.solid}>
        <meshStandardMaterial ref={mat} color="#cfeef6" roughness={0.5} metalness={0.05} />
      </mesh>

      {showDistricts && (
        <lineSegments geometry={built.districtLines}>
          <lineBasicMaterial color="#ffffff" transparent opacity={hovered ? 0.9 : 0.45} />
        </lineSegments>
      )}
      <lineSegments geometry={built.borderLines}>
        <lineBasicMaterial color={hovered ? "#04303f" : "#0a4a60"} transparent opacity={0.92} />
      </lineSegments>

      <Html
        position={[built.center[0], built.center[1], 1]}
        center
        distanceFactor={11}
        zIndexRange={[30, 0]}
        className="pointer-events-none select-none"
      >
        <div className={`-translate-y-4 transition-transform duration-300 ${hovered ? "scale-110" : ""}`}>
          <div
            className={`flex flex-col items-center rounded-lg border px-2 py-1 shadow-[0_6px_16px_rgba(11,44,58,0.22)] transition-colors ${
              hovered ? "border-aqua-500 bg-aqua-950 text-white" : "border-aqua-200 bg-white/92"
            }`}
          >
            <span className={`text-[9.5px] font-semibold leading-none tracking-wide ${hovered ? "text-aqua-300" : "text-aqua-700"}`}>
              {label.name.length > 13 ? label.abbr : label.name}
            </span>
            <span className="font-display mt-0.5 text-[12px] font-bold leading-none">
              {max > 0 && value > 0 ? formatCompact(value) : "—"}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ------------------------------- scene ------------------------------- */
function Scene(props: {
  values: Record<string, number>;
  hovered: RegionKey | null;
  onHover: (k: RegionKey | null) => void;
  onSelect: (k: RegionKey) => void;
  labels: Record<string, { name: string; abbr: string }>;
  showDistricts: boolean;
}) {
  const built = useMemo(() => buildAll(), []);
  const max = Math.max(0, ...Object.values(props.values));

  return (
    <>
      <ambientLight intensity={0.92} />
      <directionalLight position={[5, 11, 5]} intensity={1.2} />
      <directionalLight position={[-7, 5, -6]} intensity={0.32} color="#9de9fa" />
      <hemisphereLight args={["#eafcff", "#dff4fa", 0.5]} />
      <OrbitControls
        makeDefault
        target={[0, 0.65, 0.2]}
        enablePan={false}
        minDistance={7}
        maxDistance={18}
        minPolarAngle={0.22}
        maxPolarAngle={1.2}
        autoRotate
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.08}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <circleGeometry args={[9, 72]} />
        <meshBasicMaterial color="#e9f8fc" />
      </mesh>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {built.map((b) => (
          <Province
            key={b.region}
            built={b}
            value={props.values[b.region] ?? 0}
            max={max}
            hovered={props.hovered === b.region}
            onHover={props.onHover}
            onSelect={props.onSelect}
            label={props.labels[b.region] ?? { name: b.region, abbr: b.region }}
            showDistricts={props.showDistricts}
          />
        ))}
      </group>
    </>
  );
}

export default function PakistanMap3D(props: {
  values: Record<string, number>;
  hovered: RegionKey | null;
  onHover: (k: RegionKey | null) => void;
  onSelect: (k: RegionKey) => void;
  labels: Record<string, { name: string; abbr: string }>;
  showDistricts: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.7]}
      camera={{ position: [-4.4, 8.8, 9.6], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
