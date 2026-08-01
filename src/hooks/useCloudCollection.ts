import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Generic owner-scoped collection hook.
 *
 * Each row in the table has: id, owner_id, data (JSONB), case_id (optional),
 * created_at, updated_at. The hook hydrates each row by spreading `data` and
 * adding id/createdAt/updatedAt so legacy components keep working unchanged.
 *
 * Migration of legacy localStorage entries happens once per user per table.
 */

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

interface Options {
  legacyKey?: string; // localStorage key to migrate from (one-time)
  caseIdField?: keyof never; // not used currently
}

export function useCloudCollection<T extends BaseEntity>(
  table: CloudTable,
  options: Options = {},
) {
  const { user } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  // `cases` is the root table and has no case_id column; it does have `name`.
  const buildPayload = useCallback(
    (rest: any, caseId?: string) => {
      const payload: Record<string, unknown> = { data: rest };
      if (table === "cases") {
        if (typeof rest?.name === "string") payload.name = rest.name;
      } else {
        payload.case_id = caseId || null;
      }
      return payload;
    },
    [table],
  );

  const hydrate = useCallback((row: any): T => ({
    ...(row.data || {}),
    id: row.id,
    caseId: row.case_id ?? (row.data?.caseId ?? undefined),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } as T), []);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(`fetch ${table} failed`, error);
      setItems([]);
    } else {
      setItems((data || []).map(hydrate));
    }
    setLoading(false);
  }, [user, table, hydrate]);

  // One-time migration from localStorage
  const migrateLegacy = useCallback(async () => {
    if (!user || !options.legacyKey) return;
    const flagKey = `ba-app:migrated:${table}:${user.id}`;
    if (localStorage.getItem(flagKey)) return;
    try {
      const raw = localStorage.getItem(options.legacyKey);
      if (!raw) {
        localStorage.setItem(flagKey, "1");
        return;
      }
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr) || arr.length === 0) {
        localStorage.setItem(flagKey, "1");
        return;
      }
      const rows = arr.map((it: any) => {
        const { id, createdAt, updatedAt, caseId, ...rest } = it;
        return { owner_id: user.id, ...buildPayload(rest, caseId) };
      });
      const { error } = await (supabase as any).from(table).insert(rows);
      if (error) console.warn(`migration of ${table} failed`, error);
      localStorage.setItem(flagKey, "1");
    } catch (e) {
      console.warn("migrateLegacy", e);
    }
  }, [user, table, options.legacyKey, buildPayload]);

  useEffect(() => {
    (async () => {
      await migrateLegacy();
      await fetchAll();
    })();
  }, [migrateLegacy, fetchAll]);

  const add = useCallback(async (item: T) => {
    if (!user) return null;
    const { id, createdAt, updatedAt, caseId, ...rest } = item as any;
    const { data, error } = await (supabase as any)
      .from(table)
      .insert({ owner_id: user.id, ...buildPayload(rest, caseId) })
      .select()
      .single();
    if (error) {
      console.error(`insert ${table} failed`, error);
      return null;
    }
    const hydrated = hydrate(data);
    setItems((prev) => [hydrated, ...prev]);
    await supabase.from("audit_logs").insert({
      owner_id: user.id, action: "create", entity: table, entity_id: data.id,
    });
    return hydrated;
  }, [user, table, hydrate, buildPayload]);

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    if (!user) return;
    // Merge with existing
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, ...updates } : it));
    const current = items.find((i) => i.id === id);
    const merged = { ...current, ...updates } as any;
    const { id: _id, createdAt: _c, updatedAt: _u, caseId, ...rest } = merged;
    const { error } = await (supabase as any)
      .from(table)
      .update(buildPayload(rest, caseId))
      .eq("id", id);
    if (error) console.error(`update ${table} failed`, error);
    else {
      await supabase.from("audit_logs").insert({
        owner_id: user.id, action: "update", entity: table, entity_id: id,
      });
    }
  }, [user, table, items, buildPayload]);

  const remove = useCallback(async (id: string) => {
    if (!user) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    const { error } = await (supabase as any).from(table).delete().eq("id", id);
    if (error) console.error(`delete ${table} failed`, error);
    else {
      await supabase.from("audit_logs").insert({
        owner_id: user.id, action: "delete", entity: table, entity_id: id,
      });
    }
  }, [user, table]);

  const duplicate = useCallback(async (id: string) => {
    const original = items.find((i) => i.id === id);
    if (!original) return null;
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = original as any;
    const copy = {
      ...rest,
      name: rest.name ? `${rest.name} (עותק)` : undefined,
      title: rest.title ? `${rest.title} (עותק)` : undefined,
    } as T;
    return add(copy);
  }, [items, add]);

  return { items, loading, add, update, remove, duplicate, refresh: fetchAll };
}
