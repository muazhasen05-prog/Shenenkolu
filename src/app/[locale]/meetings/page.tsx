import * as React from 'react';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import { SupportedLocale } from '@/types/database';
import { getScheduledMeetings } from '@/lib/db/queries';
import { formatDate, formatTime } from '@/lib/utils';
import { Video, Calendar, Clock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export default async function MeetingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as SupportedLocale;

  const tMeetings = await getTranslations({ locale, namespace: 'meetings' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const meetings = await getScheduledMeetings(currentLocale, 20);

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
            <Video className="h-4 w-4" />
            <span>{tMeetings('title')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            {tMeetings('title')}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {tMeetings('subtitle')}
          </p>
        </div>

        {/* Free-tier Quota Notice Strip */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Zero-Cost Community Real-Time WebRTC</p>
            <p>{tMeetings('freeTierNotice')}</p>
          </div>
        </div>

        {/* Meetings List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {tMeetings('upcomingMeetings')}
          </h2>

          {meetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meetings.map((meet) => {
                const isLive = meet.status === 'active';
                return (
                  <Card
                    key={meet.id}
                    className={`overflow-hidden transition-all flex flex-col justify-between ${
                      isLive
                        ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-border'
                    }`}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        {isLive ? (
                          <Badge variant="default" className="bg-emerald-600 animate-pulse text-xs">
                            {tMeetings('liveBadge')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            {meet.access_policy === 'public'
                              ? tMeetings('accessPublic')
                              : tMeetings('accessMembers')}
                          </Badge>
                        )}

                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          <span>{tMeetings('minutes', { count: meet.duration_minutes.toString() })}</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-lg text-foreground leading-snug">
                        {meet.title}
                      </h3>

                      {meet.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {meet.description}
                        </p>
                      )}

                      <div className="pt-2 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {formatDate(meet.scheduled_start, currentLocale)} &bull; {formatTime(meet.scheduled_start, currentLocale)}
                          </span>
                        </div>
                        {meet.host_name && (
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-primary" />
                            <span>Host: {meet.host_name}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <div className="p-6 pt-0">
                      <Link href={`/meetings/${meet.room_id}/room`} className="block w-full">
                        <Button
                          className={`w-full gap-2 ${
                            isLive ? 'bg-emerald-600 hover:bg-emerald-700 font-bold' : ''
                          }`}
                        >
                          <Video className="h-4 w-4" />
                          <span>{tMeetings('joinMeeting')}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border p-8">
              <Video className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1">
                No Scheduled Meetings Currently Open
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Check back periodically for public assembly consultations and woreda broadcasts.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
