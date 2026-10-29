'use client';

import * as React from 'react';
import { Profile, UserRole } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { ShieldCheck, UserCheck } from 'lucide-react';

export function UserRoleManager({
  users,
  currentUserId,
}: {
  users: Profile[];
  currentUserId: string;
}) {
  const [userList, setUserList] = React.useState<Profile[]>(users);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUserList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update user role');
      }
    } catch {
      alert('Error updating user role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-y border-border">
          <tr>
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Current Role</th>
            <th className="py-3 px-4">Registered Date</th>
            <th className="py-3 px-4 text-right">Assign RBAC Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {userList.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">
                        {user.full_name}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] text-primary font-bold">
                          (Your Active Session)
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                  {user.email}
                </td>

                <td className="py-3 px-4">
                  <Badge
                    variant={
                      user.role === 'super_admin'
                        ? 'default'
                        : user.role === 'editor'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="capitalize text-xs"
                  >
                    {user.role === 'super_admin' && (
                      <ShieldCheck className="h-3 w-3 mr-1 inline" />
                    )}
                    {user.role.replace('_', ' ')}
                  </Badge>
                </td>

                <td className="py-3 px-4 text-xs text-muted-foreground">
                  {formatDate(user.created_at, 'en')}
                </td>

                <td className="py-3 px-4 text-right">
                  {isSelf ? (
                    <span className="text-xs text-muted-foreground italic">Protected</span>
                  ) : (
                    <select
                      value={user.role}
                      disabled={updatingId === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="rounded-md border border-input bg-background px-2.5 py-1 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="member">Member</option>
                      <option value="moderator">Moderator</option>
                      <option value="editor">Editor</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
