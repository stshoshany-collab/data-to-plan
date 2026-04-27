import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type CloudTable =
  | "cases"
  | "goals"
  | "abc_observations"
  | "session_plans"
  | "intervention_plans"
  | "reports";

interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  caseId?: string;
}

/**
 * Drop-in cloud-backed replacement for useLocalStorageState<T[]>.
 *
 * Same signature: returns [items, setItems, reset]. On each setItems call, we
 * diff against the previous server snapshot and run the necessary
 * insert/update/delete in the background. The local state updates immediately
 * (optimistic), so UX is identical to the localStorage version.
 *
 * One-time migration from localStorage runs on first mount per user per table.
 */
export function useCloudArrayState<T extends BaseEntity>(
  table: CloudTable,
  legacyKey: string,
  initial: T[] | (() => T[]) = [],
) {
  const { user } = useAuth();
  const [items, setItemsLocal] = useState<T[]>(() =>
    typeof initial === "function" ? (initial as () => T[])() : initial,
  );
  const serverIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  const stripMeta = (it: T) => {
    const { id, createdAt, updatedAt, caseId, ...rest } = it as any;
    return { rest, caseId };
  };

  // Migrate legacy + initial fetch
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const flagKey = `ba-app:migrated:${table}:${user.id}`;
      // Migration
      if (!localStorage.getItem(flagKey)) {
        try {
          const raw = localStorage.getItem(legacyKey);
          if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length > 0) {
              const rows = arr.map((it: any) => {
                const { rest, caseId } = stripMeta(it);
                return { owner_id: user.id, case_id: caseId || null, data: rest };
              });
              await (supabase as any).from(table).insert(rows);
            }
          }
        } catch (e) {
          console.warn("legacy migration failed", table, e);
        }
        localStorage.setItem(flagKey, "1");
      }

      // Fetch
      const { data, error } = await (supabase as any)
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        console.error("fetch failed", table, error);
        return;
      }
      const hydrated: T[] = (data || []).map((r: any) => ({
        ...(r.data || {}),
        id: r.id,
        caseId: r.case_id ?? r.data?.caseId,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
      serverIdsRef.current = new Set(hydrated.map((h) => h.id));
      initializedRef.current = true;
      setItemsLocal(hydrated);
    })();
    return () => { cancelled = true; };
  }, [user, table, legacyKey]);

  // Main setter — optimistic local update + background sync
  const setItems = useCallback((updater: T[] | ((prev: T[]) => T[])) => {
    setItemsLocal((prev) => {
      const next = typeof updater === "function" ? (updater as (p: T[]) => T[])(prev) : updater;

      // Skip sync until we've loaded server data
      if (!user || !initializedRef.current) return next;

      const prevById = new Map(prev.map((p) => [p.id, p]));
      const nextIds = new Set(next.map((n) => n.id));
      const serverIds = serverIdsRef.current;

      // Inserts: in next, not yet on server
      const inserts: T[] = [];
      // Updates: in both, content changed
      const updates: T[] = [];
      for (const it of next) {
        if (!serverIds.has(it.id)) {
          inserts.push(it);
        } else {
          const old = prevById.get(it.id);
          if (!old || JSON.stringify(old) !== JSON.stringify(it)) {
            updates.push(it);
          }
        }
      }
      // Deletes: on server, not in next
      const deletes: string[] = [];
      for (const sid of serverIds) {
        if (!nextIds.has(sid)) deletes.push(sid);
      }

      (async () => {
        try {
          if (inserts.length) {
            const rows = inserts.map((it) => {
              const { rest, caseId } = stripMeta(it);
              return {
                owner_id: user.id,
                case_id: caseId || null,
                data: rest,
                id: it.id, // keep client-side UUID so subsequent updates match
              };
            });
            const { error } = await (supabase as any).from(table).insert(rows);
            if (error) console.error("cloud insert failed", table, error);
            else {
              inserts.forEach((it) => serverIdsRef.current.add(it.id));
              await (supabase as any).from("audit_logs").insert(
                inserts.map((it) => ({
                  owner_id: user.id, action: "create", entity: table, entity_id: it.id,
                })),
              );
            }
          }
          for (const it of updates) {
            const { rest, caseId } = stripMeta(it);
            const { error } = await (supabase as any)
              .from(table)
              .update({ data: rest, case_id: caseId || null })
              .eq("id", it.id);
            if (error) console.error("cloud update failed", table, error);
            else {
              await (supabase as any).from("audit_logs").insert({
                owner_id: user.id, action: "update", entity: table, entity_id: it.id,
              });
            }
          }
          if (deletes.length) {
            const { error } = await (supabase as any).from(table).delete().in("id", deletes);
            if (error) console.error("cloud delete failed", table, error);
            else {
              deletes.forEach((id) => serverIdsRef.current.delete(id));
              await (supabase as any).from("audit_logs").insert(
                deletes.map((id) => ({
                  owner_id: user.id, action: "delete", entity: table, entity_id: id,
                })),
              );
            }
          }
        } catch (e) {
          console.error("cloud sync error", table, e);
        }
      })();

      return next;
    });
  }, [user, table]);

  const reset = useCallback(() => {
    setItems(typeof initial === "function" ? (initial as () => T[])() : initial);
  }, [setItems, initial]);

  return [items, setItems, reset] as const;
}
