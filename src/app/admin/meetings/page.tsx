import * as React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatTime } from '@/lib/utils';
import { Video, Plus, ExternalLink, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default async function AdminMeetingsPage() {
  const supabase = await createClient();

  const { data: meetings } = await supabase
    .from('meetings')
    .select(`
      id,
      room_id,
      host_name,
      scheduled_start,
      duration_minutes,
      access_policy,
      status,
      max_participants,
      translations:meeting_translations (
        locale,
        title
      )
    `)
    .order('scheduled_start', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Online Meetings & Town Halls
          </h2>
          <p className="text-sm text-muted-foreground">
            Schedule LiveKit audio/video rooms, assign hosts, and manage session status.
          </p>
        </div>

        <Link href="/admin/meetings/new">
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Schedule Meeting</span>
          </Button>
        </Link>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <span>All Scheduled & Active Sessions</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {meetings && meetings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-y border-border">
                  <tr>
                    <th className="py-3 px-4">Title & Room ID</th>
                    <th className="py-3 px-4">Access Policy</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Scheduled Start</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4 text-right">Join Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {meetings.map((meet) => {
                    const transList = meet.translations || [];
                    const enTitle =
                      transList.find((t: { locale: string }) => t.locale === 'en')?.title ||
                      transList[0]?.title ||
                      'Untitled Session';

                    return (
                      <tr key={meet.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-foreground block">
                            {enTitle}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            ID: {meet.room_id}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs capitalize">
                            {meet.access_policy}
                          </Badge>
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              meet.status === 'active'
                                ? 'default'
                                : meet.status === 'scheduled'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="text-xs capitalize"
                          >
                            {meet.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {formatDate(meet.scheduled_start, 'en')} &bull;{' '}
                          {formatTime(meet.scheduled_start, 'en')}
                        </td>

                        <td className="py-3 px-4 text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{meet.duration_minutes} min</span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Link href={`/en/meetings/${meet.room_id}/room`} target="_blank">
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Open Room</span>
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground space-y-3">
              <Video className="h-10 w-10 mx-auto text-muted-foreground/30" />
              <p>No meetings scheduled yet.</p>
              <Link href="/admin/meetings/new">
                <Button size="sm">Schedule First Session</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
