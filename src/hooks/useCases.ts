import { useCallback, useEffect, useRef, useState } from "react";
import { Case, createEmptyCase, demoCases } from "@/types/case";

const STORAGE_KEY = "ba-app:cases:v1";
const SEEDED_KEY = "ba-app:cases:seeded:v1";

function loadCases(): Case[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Case[];
    }
    // First-time seed with demo data (only once)
    if (!localStorage.getItem(SEEDED_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoCases));
      localStorage.setItem(SEEDED_KEY, "1");
      return demoCases;
    }
  } catch (err) {
    console.error("Failed to load cases", err);
  }
  return [];
}

function saveCases(cases: Case[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (err) {
    console.error("Failed to save cases", err);
  }
}

export function useCases() {
  const [cases, setCases] = useState<Case[]>(() => loadCases());
  const isFirstRender = useRef(true);

  // Persist on every change (skip first render to avoid redundant write)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveCases(cases);
  }, [cases]);

  // Sync between tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setCases(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addCase = useCallback((c: Case) => {
    setCases((prev) => [
      { ...c, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const updateCase = useCallback((id: string, updates: Partial<Case>) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c,
      ),
    );
  }, []);

  const deleteCase = useCallback((id: string) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const duplicateCase = useCallback((id: string) => {
    let newId: string | null = null;
    setCases((prev) => {
      const original = prev.find((c) => c.id === id);
      if (!original) return prev;
      const copy: Case = {
        ...original,
        id: crypto.randomUUID(),
        name: `${original.name || "ללא שם"} (עותק)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      newId = copy.id;
      return [copy, ...prev];
    });
    return newId;
  }, []);

  const getCase = useCallback(
    (id: string) => cases.find((c) => c.id === id),
    [cases],
  );

  return {
    cases,
    addCase,
    updateCase,
    deleteCase,
    duplicateCase,
    getCase,
    createEmptyCase,
  };
}
