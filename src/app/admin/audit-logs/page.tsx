import * as React from 'react';
import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { History, ShieldAlert, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default async function AdminAuditLogsPage() {
  await requireRole(['super_admin'], '/admin');
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          <span>Administrative Audit Trail</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Tamper-evident system activity log recording all content modifications, role changes, and broadcasts.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <span>Audit Records (Last 50 Events)</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {logs && logs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-mono text-xs">
                          {log.action}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                        {log.actor_email || 'System'}
                      </td>

                      <td className="py-3 px-4 text-xs capitalize text-muted-foreground">
                        {log.entity_type}
                      </td>

                      <td className="py-3 px-4 text-xs text-muted-foreground max-w-xs truncate">
                        {log.details ? JSON.stringify(log.details) : '—'}
                      </td>

                      <td className="py-3 px-4 text-xs text-muted-foreground text-right">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(log.created_at, 'en')}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No audit logs recorded yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
