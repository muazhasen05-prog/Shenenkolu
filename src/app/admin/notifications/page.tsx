import * as React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Send, Users, History, Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { NotificationBroadcastForm } from '@/components/admin/NotificationBroadcastForm';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default async function AdminNotificationsPage() {
  const supabase = await createClient();

  const [
    { count: subscriberCount },
    { data: notificationsList },
  ] = await Promise.all([
    supabase.from('push_subscriptions').select('*', { count: 'exact', head: true }),
    supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <span>Web Push Notification Center</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Broadcast real-time push alerts to subscribed community devices via the browser Push API and VAPID.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Subscribers
            </span>
            <div className="text-2xl font-extrabold text-foreground">
              {subscriberCount || 0} Devices
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Broadcast Form */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              <span>Broadcast New Web Push Alert</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <NotificationBroadcastForm />
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4 text-primary" />
              <span>Broadcast History</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {notificationsList && notificationsList.length > 0 ? (
              <div className="divide-y divide-border">
                {notificationsList.map((notif) => (
                  <div key={notif.id} className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground line-clamp-1">
                        {notif.title}
                      </span>
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {notif.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Delivered to: {notif.delivered_count} devices</span>
                      <span>{formatDate(notif.created_at, 'en')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No notifications broadcast yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
