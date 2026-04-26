import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic localStorage-backed state with cross-tab sync.
 * - Reads once on init.
 * - Persists on every change (skipping the very first render).
 */
export function useLocalStorageState<T>(key: string, initial: T | (() => T)) {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return typeof initial === "function" ? (initial as () => T)() : initial;
    }
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch (err) {
      console.error(`Failed to read ${key} from localStorage`, err);
    }
    return typeof initial === "function" ? (initial as () => T)() : initial;
  });

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error(`Failed to write ${key} to localStorage`, err);
    }
  }, [key, state]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  const reset = useCallback(() => {
    setState(typeof initial === "function" ? (initial as () => T)() : initial);
  }, [initial]);

  return [state, setState, reset] as const;
}
