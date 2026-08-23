"use client";

import { Mic, MicOff } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";

export function VoiceField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  glowing,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  glowing?: boolean;
}) {
  const speech = useSpeech((text) => {
    // Append or replace — if field is empty, set; otherwise append with space
    const clean = text.charAt(0).toUpperCase() + text.slice(1);
    onChange(value ? `${value} ${clean}` : clean);
  });

  return (
    <div>
      <label className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</label>
      <div className="relative mt-1">
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border py-1.5 pl-2.5 pr-9 text-[11.5px] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-300 ${
            speech.listening
              ? "border-rose-400 bg-rose-50/40 ring-2 ring-rose-200"
              : glowing
                ? "border-aqua-400 bg-aqua-50/30 ring-2 ring-aqua-200"
                : "border-slate-200 focus:border-aqua-400"
          }`}
        />
        {speech.supported && !disabled && (
          <button
            type="button"
            onClick={speech.toggle}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors ${
              speech.listening
                ? "animate-pulse bg-rose-500 text-white"
                : "text-slate-300 hover:bg-aqua-50 hover:text-aqua-600"
            }`}
            title={speech.listening ? "Stop recording" : "Speak to fill this field"}
          >
            {speech.listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export function VoiceTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const speech = useSpeech((text) => {
    const clean = text.charAt(0).toUpperCase() + text.slice(1);
    onChange(value ? `${value} ${clean}` : clean);
  });

  return (
    <div>
      {label && <label className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</label>}
      <div className="relative mt-1">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full resize-none rounded-xl border p-3 pr-10 text-[12px] outline-none ${
            speech.listening
              ? "border-rose-400 bg-rose-50/40 ring-2 ring-rose-200"
              : "border-slate-200 focus:border-aqua-400"
          }`}
        />
        {speech.supported && (
          <button
            type="button"
            onClick={speech.toggle}
            className={`absolute right-2 top-2 rounded-full p-1.5 transition ${
              speech.listening
                ? "animate-pulse bg-rose-500 text-white"
                : "text-slate-300 hover:bg-aqua-50 hover:text-aqua-600"
            }`}
            title={speech.listening ? "Stop" : "Dictate"}
          >
            {speech.listening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
