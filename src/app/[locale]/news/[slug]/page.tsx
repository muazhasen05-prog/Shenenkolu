import * as React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import { SupportedLocale } from '@/types/database';
import { getNewsArticleBySlug, getPublishedNews } from '@/lib/db/queries';
import { formatDate } from '@/lib/utils';
import { Calendar, User, ArrowLeft, Share2, Tag, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const currentLocale = locale as SupportedLocale;
  const article = await getNewsArticleBySlug(slug, currentLocale);

  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [{ url: article.featured_image }] : [],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const currentLocale = locale as SupportedLocale;

  const tNews = await getTranslations({ locale, namespace: 'news' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const article = await getNewsArticleBySlug(slug, currentLocale);
  if (!article) {
    notFound();
  }

  // Related articles in same category or recent
  const relatedArticles = (await getPublishedNews(currentLocale, 4)).filter(
    (a) => a.id !== article.id
  ).slice(0, 3);

  return (
    <article className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/news">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to News Archive</span>
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="text-xs">
              <Tag className="h-3 w-3 mr-1 inline" />
              {article.category}
            </Badge>
            {article.is_pinned && (
              <Badge variant="secondary" className="text-xs">
                Pinned Story
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formatDate(article.published_at, currentLocale)}</span>
              </span>
              {article.author_name && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" />
                  <span>{article.author_name}</span>
                </span>
              )}
            </div>

            <div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Share2 className="h-3.5 w-3.5" />
                <span>{tNews('share')}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {article.featured_image && (
          <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-muted border border-border shadow-md">
            <Image
              src={article.featured_image}
              alt={article.title || 'News cover image'}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed pt-2 space-y-6 text-base sm:text-lg">
          {article.body ? (
            article.body.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-muted-foreground italic">No article body content available.</p>
          )}
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="pt-16 border-t border-border space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              {tNews('relatedArticles')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Card key={rel.id} className="overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
                  <div>
                    {rel.featured_image && (
                      <div className="relative h-32 w-full bg-muted">
                        <Image
                          src={rel.featured_image}
                          alt={rel.title || 'Related article'}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4 space-y-2">
                      <span className="text-[11px] font-semibold text-primary">
                        {rel.category}
                      </span>
                      <h4 className="font-bold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                        <Link href={`/news/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                    </CardContent>
                  </div>
                  <div className="p-4 pt-0">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(rel.published_at, currentLocale)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
