export type OrderStatus = "sent" | "acknowledged" | "fulfilled" | "collected" | "cancelled";
export type Availability = "pending" | "in_stock" | "partial" | "out_of_stock" | "substituted";

export const FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Thrice daily",
  "Four times daily",
  "Every 6 hours",
  "Every 8 hours",
  "At night",
  "As needed",
];

export const INSTRUCTION_OPTIONS = [
  "After food",
  "Before food",
  "With meals",
  "Empty stomach",
  "At bedtime",
  "With plenty of water",
  "As directed",
];

export const MEDICINE_CATALOG: { name: string; strength: string; dose: string }[] = [
  { name: "Amoxicillin", strength: "500 mg", dose: "1 capsule" },
  { name: "Azithromycin", strength: "500 mg", dose: "1 tablet" },
  { name: "Cefixime", strength: "400 mg", dose: "1 capsule" },
  { name: "Paracetamol", strength: "500 mg", dose: "1 tablet" },
  { name: "Ibuprofen", strength: "400 mg", dose: "1 tablet" },
  { name: "Cetirizine", strength: "10 mg", dose: "1 tablet" },
  { name: "Omeprazole", strength: "20 mg", dose: "1 capsule" },
  { name: "Metformin", strength: "500 mg", dose: "1 tablet" },
  { name: "Amlodipine", strength: "5 mg", dose: "1 tablet" },
  { name: "Salbutamol Inhaler", strength: "100 mcg", dose: "2 puffs" },
  { name: "ORS Sachet", strength: "20 g", dose: "1 sachet" },
  { name: "Vitamin D3", strength: "50,000 IU", dose: "1 capsule" },
  { name: "Montelukast", strength: "10 mg", dose: "1 tablet" },
  { name: "Domperidone", strength: "10 mg", dose: "1 tablet" },
];

export function fmtRs(value: number): string {
  if (!Number.isFinite(value)) return "Rs 0";
  const rounded = Math.round(value * 100) / 100;
  return (
    "Rs " +
    rounded.toLocaleString("en-PK", {
      minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
      maximumFractionDigits: 2,
    })
  );
}

export function num(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function lineTotal(unitPrice: number, qty: number, discountPct: number): number {
  const gross = unitPrice * qty;
  return Math.max(0, gross * (1 - Math.min(100, Math.max(0, discountPct)) / 100));
}

export const STATUS_META: Record<
  OrderStatus,
  { label: string; chip: string; dot: string }
> = {
  sent: {
    label: "Sent to vendor",
    chip: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
  },
  acknowledged: {
    label: "Acknowledged",
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  fulfilled: {
    label: "Fulfilled · billed",
    chip: "bg-teal-50 text-teal-700 ring-teal-200",
    dot: "bg-teal-500",
  },
  collected: {
    label: "Collected by patient",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
};

export const AVAIL_META: Record<
  Availability,
  { label: string; short: string; active: string; ring: string }
> = {
  pending: {
    label: "Pending review",
    short: "Pending",
    active: "bg-slate-600 text-white shadow-sm",
    ring: "ring-slate-300",
  },
  in_stock: {
    label: "In stock",
    short: "In stock",
    active: "bg-emerald-600 text-white shadow-sm",
    ring: "ring-emerald-300",
  },
  partial: {
    label: "Partial stock",
    short: "Partial",
    active: "bg-amber-500 text-white shadow-sm",
    ring: "ring-amber-300",
  },
  out_of_stock: {
    label: "Out of stock",
    short: "Out of stock",
    active: "bg-rose-600 text-white shadow-sm",
    ring: "ring-rose-300",
  },
  substituted: {
    label: "Substituted",
    short: "Substitute",
    active: "bg-sky-600 text-white shadow-sm",
    ring: "ring-sky-300",
  },
};

export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash at counter" },
  { value: "cod", label: "Cash on delivery" },
  { value: "card", label: "Card" },
  { value: "bank", label: "Bank transfer" },
  { value: "insurance", label: "Insurance claim" },
  { value: "credit", label: "Patient credit account" },
];

export function genVendorToken(): string {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  let out = "vf_";
  for (const b of bytes) out += b.toString(36).padStart(2, "0");
  return out.slice(0, 21);
}

export function genPickupCode(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return String(n);
}

export function genOrderCode(): string {
  return `RX-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function fmtDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isExpiryPast(expiry: string | null | undefined): boolean {
  if (!expiry) return false;
  const d = new Date(expiry);
  if (Number.isNaN(d.getTime())) return false;
  return d.getTime() < Date.now();
}
