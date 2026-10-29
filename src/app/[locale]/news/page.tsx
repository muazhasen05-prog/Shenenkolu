import * as React from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import { SupportedLocale } from '@/types/database';
import { getPublishedNews } from '@/lib/db/queries';
import { formatDate } from '@/lib/utils';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default async function NewsArchivePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { locale } = await params;
  const { category, search } = await searchParams;
  const currentLocale = locale as SupportedLocale;

  const tNews = await getTranslations({ locale, namespace: 'news' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const articles = await getPublishedNews(currentLocale, 20, category);

  // Client search filter simulation over fetched articles
  const filteredArticles = search
    ? articles.filter(
        (a) =>
          a.title?.toLowerCase().includes(search.toLowerCase()) ||
          a.excerpt?.toLowerCase().includes(search.toLowerCase())
      )
    : articles;

  const categories = [
    'All',
    'Agriculture & Rural Development',
    'Infrastructure & Water',
    'Education & Youth Empowerment',
    'Civic Assembly & Good Governance',
  ];

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 space-y-8">
        {/* Page Title & Header */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
            <Newspaper className="h-4 w-4" />
            <span>{tNews('title')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {tNews('title')}
          </h1>
          <p className="text-muted-foreground text-base">
            {tNews('subtitle')}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-b border-border pb-4">
          {categories.map((cat) => {
            const isSelected = (!category && cat === 'All') || category === cat;
            const href = cat === 'All' ? '/news' : `/news?category=${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                href={href}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {cat === 'All' ? tNews('allCategories') : cat}
              </Link>
            );
          })}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between"
              >
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
                        <Newspaper className="h-10 w-10 opacity-30" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                      {article.category}
                    </span>
                  </div>

                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{formatDate(article.published_at, currentLocale)}</span>
                      {article.author_name && (
                        <>
                          <span>&bull;</span>
                          <span>{article.author_name}</span>
                        </>
                      )}
                    </div>

                    <h2 className="font-bold text-lg leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/news/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </CardContent>
                </div>

                <div className="p-6 pt-0">
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
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border p-8">
            <Newspaper className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">{tNews('noNewsFound')}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Try selecting another category or clearing your search filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
