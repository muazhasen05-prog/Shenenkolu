import * as React from 'react';
import { requireRole } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';
import { UserRoleManager } from '@/components/admin/UserRoleManager';
import { Users, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default async function AdminUsersPage() {
  const currentProfile = await requireRole(['super_admin'], '/admin');
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>User & RBAC Role Administration</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Elevate or revoke staff permissions. Restricted strictly to Super Administrators.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Registered Users & Staff Clearance</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <UserRoleManager users={users || [currentProfile]} currentUserId={currentProfile.id} />
        </CardContent>
      </Card>
    </div>
  );
}
