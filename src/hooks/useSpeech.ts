"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseSpeechReturn {
  listening: boolean;
  supported: boolean;
  start: () => void;
  stop: () => void;
  toggle: () => void;
}

interface SpeechResultItem { transcript: string }
interface SpeechResultList { 0: SpeechResultItem; length: number }
interface SpeechResult { results: SpeechResultList[] }

/**
 * Per-field voice input using the browser's built-in Web Speech API.
 * Works in Chrome, Edge, Safari — no API key or external service required.
 * On unsupported browsers (Firefox) gracefully reports supported=false.
 */
export function useSpeech(onResult: (text: string) => void): UseSpeechReturn {
  const [listening, setListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const callbackRef = useRef(onResult);
  callbackRef.current = onResult;

  const supported =
    typeof window !== "undefined" &&
    Boolean(
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition
    );

  const start = useCallback(() => {
    if (!supported) return;
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    const SR =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (SR as any)();
    rec.lang = "en-PK";
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e: SpeechResult) => {
      const first = e.results?.[0];
      const transcript = first?.[0]?.transcript ?? "";
      if (transcript) callbackRef.current(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }, [supported]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  useEffect(() => () => { recognitionRef.current?.abort(); }, []);

  return { listening, supported, start, stop, toggle };
}
