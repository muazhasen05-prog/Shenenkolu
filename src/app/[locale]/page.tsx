import * as React from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import { SupportedLocale } from '@/types/database';
import {
  getPublishedNews,
  getActiveAnnouncements,
  getPublishedGalleryItems,
  getScheduledMeetings,
} from '@/lib/db/queries';
import { formatDate, formatTime } from '@/lib/utils';
import {
  Newspaper,
  Bell,
  Video,
  ArrowRight,
  Calendar,
  Clock,
  ShieldCheck,
  Flame,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as SupportedLocale;

  const tHero = await getTranslations({ locale, namespace: 'hero' });
  const tNews = await getTranslations({ locale, namespace: 'news' });
  const tAnnouncements = await getTranslations({ locale, namespace: 'announcements' });
  const tMeetings = await getTranslations({ locale, namespace: 'meetings' });
  const tGallery = await getTranslations({ locale, namespace: 'gallery' });
  const tAbout = await getTranslations({ locale, namespace: 'about' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Parallel data fetching from real database
  const [newsArticles, announcements, galleryItems, meetings] = await Promise.all([
    getPublishedNews(currentLocale, 3),
    getActiveAnnouncements(currentLocale, 3),
    getPublishedGalleryItems(currentLocale, 4),
    getScheduledMeetings(currentLocale, 2),
  ]);

  const urgentAnnouncement = announcements.find((a) => a.priority === 'urgent');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Urgent Announcement Alert Strip (if active) */}
      {urgentAnnouncement && (
        <aside aria-label="Urgent community announcement" className="bg-gradient-to-r from-red-600 to-amber-600 text-white px-4 py-2.5 shadow-sm">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
              <Flame className="h-4 w-4 shrink-0" />
              <span className="uppercase text-xs tracking-wider font-extrabold bg-black/20 px-2 py-0.5 rounded">
                {tAnnouncements('urgentBadge')}
              </span>
              <span className="line-clamp-1">{urgentAnnouncement.title}</span>
            </div>
            <Link
              href={`/announcements`}
              className="text-xs font-bold underline whitespace-nowrap hover:opacity-90 flex items-center gap-1"
            >
              <span>{tCommon('readMore')}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-16 sm:py-24 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>{tHero('badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {tHero('title')}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {tHero('subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/news">
                <Button size="lg" className="gap-2 shadow-md">
                  <Newspaper className="h-4 w-4" />
                  <span>{tHero('readNewsBtn')}</span>
                </Button>
              </Link>
              <Link href="/meetings">
                <Button size="lg" variant="outline" className="gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  <span>{tHero('joinMeetingBtn')}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative institutional gradient blur */}
        <div className="absolute right-0 top-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-10 -z-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* Main Grid: Latest News & Announcements */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left 2 Cols: Latest News Articles */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    {tNews('latest')}
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>{tCommon('viewAll')}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 w-full bg-muted overflow-hidden">
                        {article.featured_image ? (
                          <Image
                            src={article.featured_image}
                            alt={article.title || 'News cover image'}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            <Newspaper className="h-10 w-10 opacity-40" />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                          {article.category}
                        </span>
                      </div>

                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          <span>{formatDate(article.published_at, currentLocale)}</span>
                        </div>

                        <h3 className="font-bold text-lg leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                          <Link href={`/news/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </CardContent>
                    </div>

                    <div className="p-5 pt-0">
                      <Link
                        href={`/news/${article.slug}`}
                        className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                      >
                        <span>{tCommon('readMore')}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Public Notices & Scheduled Meeting Card */}
            <div className="space-y-8">
              {/* Announcements Box */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-secondary" />
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      {tAnnouncements('activeAnnouncements')}
                    </h2>
                  </div>
                  <Link
                    href="/announcements"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {tCommon('viewAll')}
                  </Link>
                </div>

                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant={ann.priority === 'urgent' ? 'urgent' : 'outline'}>
                          {ann.priority === 'urgent'
                            ? tAnnouncements('urgentBadge')
                            : tAnnouncements('normalBadge')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(ann.published_at, currentLocale)}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground line-clamp-2">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {ann.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Online Meetings */}
              <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-emerald-500/10 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base text-foreground">
                    {tMeetings('upcomingMeetings')}
                  </h3>
                </div>

                {meetings.length > 0 ? (
                  meetings.map((meet) => (
                    <div key={meet.id} className="space-y-3 bg-card p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <Badge variant="default" className="text-[10px]">
                          {meet.access_policy === 'public'
                            ? tMeetings('accessPublic')
                            : tMeetings('accessMembers')}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{tMeetings('minutes', { count: meet.duration_minutes.toString() })}</span>
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-foreground">{meet.title}</h4>

                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>
                          {formatDate(meet.scheduled_start, currentLocale)} &bull; {formatTime(meet.scheduled_start, currentLocale)}
                        </span>
                      </div>

                      <Link href={`/meetings/${meet.room_id}/room`} className="block w-full">
                        <Button size="sm" className="w-full gap-2">
                          <Video className="h-3.5 w-3.5" />
                          <span>{tCommon('join')}</span>
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No public meetings currently scheduled. Check back soon.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Photo Gallery Strip */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {tGallery('title')}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {tGallery('subtitle')}
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>{tCommon('viewAll')}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative h-48 rounded-xl overflow-hidden bg-card border border-border shadow-sm"
              >
                <Image
                  src={item.image_url}
                  alt={item.alt_text || item.title || 'Gallery item'}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-semibold line-clamp-2">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About & Institutional Values Summary */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-border bg-gradient-to-r from-card to-muted/40 p-8 sm:p-12 shadow-sm">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {tAbout('title')}
              </span>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                {tAbout('missionTitle')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {tAbout('missionDesc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Integrity & Trust</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accountable governance and community representation.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>Prosperity for All</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Modern agriculture, clean water, and civic development.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Citizen Unity</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Peaceful, inclusive participation across every kebele.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
