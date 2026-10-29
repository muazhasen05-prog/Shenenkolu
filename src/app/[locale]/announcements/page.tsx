import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { SupportedLocale } from '@/types/database';
import { getActiveAnnouncements } from '@/lib/db/queries';
import { formatDate } from '@/lib/utils';
import { Bell, AlertTriangle, Calendar, FileText, Download, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default async function AnnouncementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as SupportedLocale;

  const tAnnouncements = await getTranslations({ locale, namespace: 'announcements' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const announcements = await getActiveAnnouncements(currentLocale, 20);

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-secondary text-sm font-bold uppercase tracking-wider">
            <Bell className="h-4 w-4" />
            <span>{tAnnouncements('title')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {tAnnouncements('title')}
          </h1>
          <p className="text-muted-foreground text-base">
            {tAnnouncements('subtitle')}
          </p>
        </div>

        {/* Notices list */}
        {announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((ann) => {
              const isUrgent = ann.priority === 'urgent';
              return (
                <Card
                  key={ann.id}
                  className={`overflow-hidden transition-all ${
                    isUrgent
                      ? 'border-accent/40 bg-accent/5 shadow-sm'
                      : 'border-border bg-card'
                  }`}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={isUrgent ? 'urgent' : 'outline'}>
                          {isUrgent && <AlertTriangle className="h-3 w-3 mr-1 inline" />}
                          {isUrgent
                            ? tAnnouncements('urgentBadge')
                            : tAnnouncements('normalBadge')}
                        </Badge>
                        {ann.is_pinned && (
                          <Badge variant="secondary" className="gap-1">
                            <Pin className="h-3 w-3" />
                            <span>{tAnnouncements('pinned')}</span>
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>{formatDate(ann.published_at, currentLocale)}</span>
                        </span>
                        {ann.expires_at && (
                          <span>
                            {tAnnouncements('validUntil')}: {formatDate(ann.expires_at, currentLocale)}
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-foreground leading-snug">
                      {ann.title}
                    </h2>

                    <div className="text-sm text-foreground/90 leading-relaxed space-y-2">
                      {ann.body?.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {ann.attachment_url && (
                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FileText className="h-4 w-4 text-primary" />
                          <span>{ann.attachment_name || 'Official Circular Document'}</span>
                        </div>
                        <a
                          href={ann.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <Download className="h-3.5 w-3.5" />
                            <span>{tAnnouncements('downloadAttachment')}</span>
                          </Button>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border p-8">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">
              {tAnnouncements('noAnnouncements')}
            </h3>
            <p className="text-sm text-muted-foreground">
              Official circulars and public notices will appear here once issued by the administration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
