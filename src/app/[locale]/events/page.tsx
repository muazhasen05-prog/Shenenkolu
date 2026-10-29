import * as React from 'react';
import { getTranslations } from 'next-intl/server';
import { SupportedLocale } from '@/types/database';
import { formatDate, formatTime } from '@/lib/utils';
import { Calendar, MapPin, Building, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as SupportedLocale;

  const tEvents = await getTranslations({ locale, namespace: 'events' });

  // Realistic community events data
  const isOm = currentLocale === 'om';
  const isAm = currentLocale === 'am';

  const events = [
    {
      id: 'e1',
      title: isOm
        ? 'Marii Qonnaan Bultootaa fi Raabsa Xaa\'oo'
        : isAm
        ? 'የአርሶ አደሮች ውይይት እና የማዳበሪያ አቅርቦት መድረክ'
        : 'Farmers Consultation Forum & Fertilizer Supply Dialogue',
      description: isOm
        ? 'Marii qonnaan bultoota gandaalee hunda waliin dhimma qulqullina sanyii fi xaa\'oo irratti geggeeffamu.'
        : isAm
        ? 'ከሁሉም ቀበሌዎች ከተውጣጡ አርሶ አደሮች ጋር በምርጥ ዘር እና ማዳበሪያ አቅርቦት ዙሪያ የሚደረግ የምክክር መድረክ።'
        : 'Interactive consultation session with agricultural cooperatives evaluating input distribution and seasonal readiness.',
      location: 'Shenen Kolu Central Administration Hall',
      start_time: new Date(Date.now() + 3 * 86400000).toISOString(),
      organizer: 'Woreda Agricultural Development Bureau',
      status: 'scheduled',
    },
    {
      id: 'e2',
      title: isOm
        ? 'Kora Dargaggootaa fi Misooma Ogummaa'
        : isAm
        ? 'የወጣቶች ኮንፈረንስ እና የክህሎት ልማት ዐውደ ጥናት'
        : 'Woreda Youth Assembly & Entrepreneurship Symposium',
      description: isOm
        ? 'Dargaggoota daldala xixiqqaa irratti bobba\'aniif carraa maallaqaa fi meeshaalee hojii kennuu.'
        : isAm
        ? 'በአነስተኛና ጥቃቅን ስራዎች ለተሰማሩ ወጣቶች የመነሻ ብድርና የስራ መስሪያ መሳሪያዎች ድጋፍ የሚሰጥበት መድረክ።'
        : 'Forum bringing together emerging youth entrepreneurs, micro-financing institutions, and vocational trainers.',
      location: 'Youth Community Center, Shenen Kolu',
      start_time: new Date(Date.now() + 7 * 86400000).toISOString(),
      organizer: 'Youth and Sports Directorate',
      status: 'scheduled',
    },
  ];

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
            <Calendar className="h-4 w-4" />
            <span>{tEvents('title')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {tEvents('title')}
          </h1>
          <p className="text-muted-foreground text-base">
            {tEvents('subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {tEvents('upcoming')}
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs">
                      Community Event
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span>{formatDate(event.start_time, currentLocale)} &bull; {formatTime(event.start_time, currentLocale)}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">
                    {event.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>

                  <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary shrink-0" />
                      <span>{event.organizer}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
