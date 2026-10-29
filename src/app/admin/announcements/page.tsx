import * as React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Bell, Plus, Pin, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  const { data: announcements } = await supabase
    .from('announcements')
    .select(`
      id,
      priority,
      status,
      is_pinned,
      attachment_url,
      attachment_name,
      published_at,
      expires_at,
      translations:announcement_translations (
        locale,
        title
      )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Public Announcements Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Broadcast official circulars, civic notices, and urgent administrative advisories.
          </p>
        </div>

        <Link href="/admin/announcements/new">
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>New Announcement</span>
          </Button>
        </Link>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-secondary" />
            <span>All Notices</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {announcements && announcements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-y border-border">
                  <tr>
                    <th className="py-3 px-4">Notice Title</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Published</th>
                    <th className="py-3 px-4">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {announcements.map((ann) => {
                    const transList = ann.translations || [];
                    const enTitle =
                      transList.find((t: { locale: string }) => t.locale === 'en')?.title ||
                      transList[0]?.title ||
                      'Untitled Notice';

                    return (
                      <tr key={ann.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {ann.is_pinned && <Pin className="h-3.5 w-3.5 text-secondary" />}
                            <span className="font-semibold text-foreground line-clamp-1">
                              {enTitle}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant={ann.priority === 'urgent' ? 'urgent' : 'outline'}
                            className="text-xs"
                          >
                            {ann.priority === 'urgent' && (
                              <AlertTriangle className="h-3 w-3 mr-1 inline" />
                            )}
                            <span className="capitalize">{ann.priority}</span>
                          </Badge>
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant="outline" className="capitalize text-xs">
                            {ann.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {formatDate(ann.published_at, 'en')}
                        </td>

                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {ann.expires_at ? formatDate(ann.expires_at, 'en') : 'Indefinite'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground space-y-3">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground/30" />
              <p>No announcements created yet.</p>
              <Link href="/admin/announcements/new">
                <Button size="sm">Create First Notice</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
