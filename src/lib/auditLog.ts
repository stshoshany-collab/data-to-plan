import { supabase } from "@/integrations/supabase/client";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "export"
  | "upload"
  | "process";

export type AuditEntity =
  | "case"
  | "goal"
  | "abc_observation"
  | "session_plan"
  | "intervention_plan"
  | "report"
  | "file"
  | "export";

/**
 * Lightweight audit log writer. Failures are swallowed (logged only) so
 * primary user actions are never blocked by telemetry issues.
 */
export async function logAudit(
  action: AuditAction,
  entity: AuditEntity,
  entityId?: string | null,
  meta: Record<string, unknown> = {},
): Promise<void> {
  try {
    const { data: userRes } = await supabase.auth.getUser();
    const ownerId = userRes.user?.id;
    if (!ownerId) return;
    await supabase.from("audit_logs").insert([
      {
        owner_id: ownerId,
        action,
        entity,
        entity_id: entityId ?? null,
        meta: meta as never,
      },
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("audit log failed", err);
  }
}
