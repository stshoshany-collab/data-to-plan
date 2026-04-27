import { useCallback } from "react";
import { useCloudCollection } from "./useCloudCollection";
import { Case, createEmptyCase } from "@/types/case";

/**
 * Cloud-backed cases hook. Same public API as the previous localStorage hook,
 * so existing components don't need to change. One-time migration from
 * `ba-app:cases:v1` runs automatically on first load per user.
 */
export function useCases() {
  const {
    items: cases,
    loading,
    add,
    update,
    remove,
    duplicate,
  } = useCloudCollection<Case>("cases", { legacyKey: "ba-app:cases:v1" });

  const addCase = useCallback((c: Case) => { void add(c); }, [add]);
  const updateCase = useCallback((id: string, updates: Partial<Case>) => {
    void update(id, updates);
  }, [update]);
  const deleteCase = useCallback((id: string) => { void remove(id); }, [remove]);
  const duplicateCase = useCallback((id: string) => { void duplicate(id); return null; }, [duplicate]);

  const getCase = useCallback(
    (id: string) => cases.find((c) => c.id === id),
    [cases],
  );

  return {
    cases,
    loading,
    addCase,
    updateCase,
    deleteCase,
    duplicateCase,
    getCase,
    createEmptyCase,
  };
}
