import { createAdminClient } from '@/lib/supabase/admin';

export interface AuditLogParams {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
}

export async function logAuditEvent(params: AuditLogParams): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from('audit_logs').insert({
      actor_id: params.actorId || null,
      actor_email: params.actorEmail || null,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      details: params.details || {},
      ip_address: params.ipAddress || null,
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
    // Non-blocking for primary transaction
  }
}
