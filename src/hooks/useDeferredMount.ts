"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Delays mounting of a heavy subtree until the browser is idle (or a
 * fallback timeout elapses) AND — if a root element is given — until it
 * has scrolled into view. This keeps first paint / initial interaction
 * fast for pages that embed the 3D map: three.js + WebGL init is deferred
 * until after the rest of the UI has already rendered.
 */
export function useDeferredMount(opts?: { timeout?: number; rootRef?: React.RefObject<Element | null> }): boolean {
  const [ready, setReady] = useState(false);
  const idleRef = useRef(false);
  const inViewRef = useRef(!opts?.rootRef);
  const timeout = opts?.timeout ?? 450;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tryCommit = () => {
      if (idleRef.current && inViewRef.current) setReady(true);
    };

    let idleHandle: number | null = null;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    let observer: IntersectionObserver | null = null;

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };

    const onIdle = () => {
      idleRef.current = true;
      tryCommit();
    };

    if (w.requestIdleCallback) idleHandle = w.requestIdleCallback(onIdle, { timeout });
    else timeoutHandle = setTimeout(onIdle, timeout);

    if (opts?.rootRef?.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            inViewRef.current = true;
            tryCommit();
          }
        },
        { rootMargin: "200px" }
      );
      observer.observe(opts.rootRef.current);
    }

    return () => {
      if (idleHandle !== null && w.cancelIdleCallback) w.cancelIdleCallback(idleHandle);
      if (timeoutHandle) clearTimeout(timeoutHandle);
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ready;
}
