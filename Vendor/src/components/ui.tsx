"use client";

import {
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* ----------------------------- Icons ----------------------------- */

const PATHS: Record<string, ReactNode> = {
  clipboard: (
    <>
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  pill: (
    <>
      <path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
  steth: (
    <>
      <path d="M5 3v6a5 5 0 0 0 10 0V3" />
      <path d="M10 14v2a6 6 0 0 0 12 0v-1" />
      <circle cx="22" cy="12" r="2" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>
  ),
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: (
    <>
      <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" />,
  printer: (
    <>
      <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="7" rx="1" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </>
  ),
  loader: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4-4" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  x: <path d="M18 6 6 18M6 6l12 12" />,
  box: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </>
  ),
  receipt: (
    <>
      <path d="M5 2h14v20l-2.3-1.5L14.4 22l-2.4-1.5L9.6 22l-2.3-1.5L5 22V2Z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </>
  ),

  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.2 3.2M6.6 6.6C3.8 8.5 2 12 2 12s3.5 7 10 7a10.6 10.6 0 0 0 5.4-1.4" />
      <path d="m3 3 18 18M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
    </>
  ),
  wallet: (
    <>
      <path d="M20 7H4a2 2 0 0 1 0-4h14v4" />
      <path d="M4 7v12a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1" />
      <path d="M16 13h2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  truck: (
    <>
      <path d="M1 4h14v12H1zM15 9h4l4 4v3h-8" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  external: (
    <>
      <path d="M15 3h6v6M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
};

export function Icon({
  name,
  className,
  strokeWidth = 1.8,
}: {
  name: keyof typeof PATHS | string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 shrink-0", className)}
      aria-hidden="true"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}

/* ----------------------------- Toasts ----------------------------- */

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; kind: ToastKind; msg: string };

let toastListeners: ((t: ToastItem) => void)[] = [];
let toastSeq = 1;

export function toast(msg: string, kind: ToastKind = "success") {
  const item = { id: toastSeq++, kind, msg };
  toastListeners.forEach((l) => l(item));
}

const TOAST_STYLE: Record<ToastKind, { ring: string; icon: string; name: string }> = {
  success: { ring: "ring-emerald-200", icon: "text-emerald-600", name: "check" },
  error: { ring: "ring-rose-200", icon: "text-rose-600", name: "alert" },
  info: { ring: "ring-sky-200", icon: "text-sky-600", name: "info" },
};

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);
  useEffect(() => {
    const listener = (t: ToastItem) => {
      setItems((s) => [...s, t]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== t.id)), 4200);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);
  return (
    <div className="no-print pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[min(92vw,360px)] flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "animate-toast-in pointer-events-auto flex items-start gap-2.5 rounded-xl bg-white px-3.5 py-3 shadow-lg ring-1",
            TOAST_STYLE[t.kind].ring
          )}
        >
          <span className={cn("mt-0.5", TOAST_STYLE[t.kind].icon)}>
            <Icon name={TOAST_STYLE[t.kind].name} className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <p className="text-[13px] font-medium leading-snug text-slate-700">{t.msg}</p>
          <button
            onClick={() => setItems((s) => s.filter((x) => x.id !== t.id))}
            className="ml-auto text-slate-400 transition hover:text-slate-600"
            aria-label="Dismiss"
          >
            <Icon name="x" className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* --------------------------- Dictation --------------------------- */

export function useDictation(onText: (t: string) => void) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const cbRef = useRef(onText);
  cbRef.current = onText;

  const supported =
    typeof window !== "undefined" &&
    Boolean(
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );

  const toggle = () => {
    if (!supported) return;
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const t: string = e.results?.[0]?.[0]?.transcript ?? "";
      if (t) cbRef.current(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  return { listening, toggle, supported };
}

export function MicButton({
  onText,
  className,
  title = "Dictate",
}: {
  onText: (t: string) => void;
  className?: string;
  title?: string;
}) {
  const { listening, toggle, supported } = useDictation(onText);
  return (
    <button
      type="button"
      title={supported ? title : "Voice input not supported in this browser"}
      aria-label={title}
      disabled={!supported}
      onClick={toggle}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-lg transition",
        listening
          ? "mic-listening bg-teal-600 text-white"
          : "text-slate-400 hover:bg-teal-50 hover:text-teal-600",
        !supported && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-slate-400",
        className
      )}
    >
      <Icon name="mic" className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  );
}

/* ----------------------------- Atoms ----------------------------- */

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-white p-5 shadow-[0_12px_32px_rgba(16,42,54,0.07)] ring-1 ring-slate-200/70 sm:p-6",
        className
      )}
    >
      {children}
    </section>
  );
}

export function SectionHead({
  icon,
  label,
  right,
  className,
}: {
  icon: string;
  label: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2 text-teal-700">
        <Icon name={icon} className="h-4 w-4" strokeWidth={2} />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em]">{label}</h2>
      </div>
      {right}
    </div>
  );
}

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400",
        className
      )}
    >
      {children}
    </span>
  );
}

const fieldBase =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] font-medium text-slate-800 placeholder:font-normal placeholder:text-slate-400 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10";

export function TextInput({
  mic,
  right,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  mic?: (t: string) => void;
  right?: ReactNode;
}) {
  return (
    <div className="relative">
      <input {...props} className={cn(fieldBase, mic || right ? "pr-10" : false, className)} />
      {(mic || right) && (
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
          {right ?? (mic ? <MicButton onText={mic} /> : null)}
        </div>
      )}
    </div>
  );
}

export function SelectInput({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={cn(fieldBase, "appearance-none pr-9", className)}>
        {children}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function TextArea({
  mic,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { mic?: (t: string) => void }) {
  return (
    <div className="relative">
      <textarea {...props} className={cn(fieldBase, "min-h-[92px] resize-y pr-10", className)} />
      {mic && (
        <div className="absolute right-1.5 top-2">
          <MicButton onText={mic} />
        </div>
      )}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; active: string }[];
  size?: "sm" | "md";
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200/70">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-lg font-semibold transition-all",
            size === "sm" ? "px-2.5 py-1 text-[11.5px]" : "px-3 py-1.5 text-[12.5px]",
            value === o.value ? o.active : "text-slate-500 hover:bg-white hover:text-slate-700"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-2.5"
    >
      <span
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-emerald-500" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </span>
      {label && (
        <span
          className={cn(
            "text-[12.5px] font-semibold",
            checked ? "text-emerald-700" : "text-slate-500"
          )}
        >
          {label}
        </span>
      )}
    </button>
  );
}

export function StatusChip({
  label,
  chip,
  dot,
}: {
  label: string;
  chip: string;
  dot: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
        chip
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

type BtnVariant = "primary" | "outline" | "ghost" | "danger" | "dark";

export function Btn({
  variant = "primary",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const styles: Record<BtnVariant, string> = {
    primary:
      "bg-gradient-to-b from-teal-500 to-teal-600 text-white shadow-[0_8px_20px_rgba(13,148,136,0.35)] hover:from-teal-400 hover:to-teal-600 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none",
    outline:
      "border border-teal-200 bg-white text-teal-700 hover:border-teal-300 hover:bg-teal-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "border border-rose-200 bg-white text-rose-600 hover:bg-rose-50",
    dark: "bg-teal-800 text-white hover:bg-teal-900",
  };
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}
