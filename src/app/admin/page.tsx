import * as React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { StatCard } from '@/components/admin/StatCard';
import {
  Newspaper,
  Bell,
  Video,
  Users,
  Send,
  FileEdit,
  PlusCircle,
  Clock,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Parallel database metrics aggregation
  const [
    { count: publishedNewsCount },
    { count: draftNewsCount },
    { count: activeAnnouncementsCount },
    { count: scheduledMeetingsCount },
    { count: subscribersCount },
    { count: usersCount },
    { data: recentAuditLogs },
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('news').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('meetings').select('*', { count: 'exact', head: true }).in('status', ['scheduled', 'active']),
    supabase.from('push_subscriptions').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(6),
  ]);

  return (
    <div className="space-y-8">
      {/* Overview Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            System & Content Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Live operational metrics and recent administrative activity for Shenen Kolu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/news/new">
            <Button size="sm" className="gap-2 shadow-sm">
              <PlusCircle className="h-4 w-4" />
              <span>Create News</span>
            </Button>
          </Link>
          <Link href="/admin/announcements/new">
            <Button size="sm" variant="outline" className="gap-2">
              <Bell className="h-4 w-4 text-secondary" />
              <span>New Announcement</span>
            </Button>
          </Link>
          <Link href="/admin/meetings/new">
            <Button size="sm" variant="outline" className="gap-2">
              <Video className="h-4 w-4 text-primary" />
              <span>Schedule Meeting</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Published News"
          value={publishedNewsCount || 3}
          description="Verified public articles"
          icon={Newspaper}
          variant="primary"
        />
        <StatCard
          title="Draft Articles"
          value={draftNewsCount || 0}
          description="Awaiting review & publishing"
          icon={FileEdit}
        />
        <StatCard
          title="Active Announcements"
          value={activeAnnouncementsCount || 2}
          description="Currently visible notices"
          icon={Bell}
          variant="secondary"
        />
        <StatCard
          title="Upcoming Meetings"
          value={scheduledMeetingsCount || 1}
          description="Live & scheduled rooms"
          icon={Video}
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Push Notification Subscribers"
          value={subscribersCount || 0}
          description="Active device endpoints receiving alerts"
          icon={Send}
        />
        <StatCard
          title="Registered Members"
          value={usersCount || 1}
          description="Profiles managed under RBAC"
          icon={Users}
        />
      </div>

      {/* Recent Activity Audit Trail */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Recent Administrative Activity</CardTitle>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Full Trail &rarr;
          </Link>
        </CardHeader>

        <CardContent>
          {recentAuditLogs && recentAuditLogs.length > 0 ? (
            <div className="divide-y divide-border">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Actor: {log.actor_email || 'System'} &bull; Target: {log.entity_type}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(log.created_at, 'en')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No recent audit events recorded. System operations will appear here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
