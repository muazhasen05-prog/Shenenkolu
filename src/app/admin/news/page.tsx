import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Newspaper, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default async function AdminNewsListPage() {
  const supabase = await createClient();

  const { data: newsItems } = await supabase
    .from('news')
    .select(`
      id,
      slug,
      category,
      featured_image,
      status,
      is_pinned,
      author_name,
      published_at,
      created_at,
      translations:news_translations (
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
            News & Article Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Create, edit, translate, and publish verified news articles for Shenen Kolu.
          </p>
        </div>

        <Link href="/admin/news/new">
          <Button className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Create Article</span>
          </Button>
        </Link>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <span>All Articles</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {newsItems && newsItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-y border-border">
                  <tr>
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {newsItems.map((item) => {
                    const transList = item.translations || [];
                    const enTitle =
                      transList.find((t: { locale: string }) => t.locale === 'en')?.title ||
                      transList[0]?.title ||
                      'Untitled';

                    return (
                      <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          {item.featured_image ? (
                            <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
                              <Image
                                src={item.featured_image}
                                alt="Thumbnail"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                              <Newspaper className="h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-foreground line-clamp-1">
                              {enTitle}
                            </span>
                            <span className="text-xs text-muted-foreground">/{item.slug}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-muted-foreground">{item.category}</td>

                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              item.status === 'published'
                                ? 'default'
                                : item.status === 'scheduled'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="capitalize text-xs"
                          >
                            {item.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {formatDate(item.published_at || item.created_at, 'en')}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link href={`/en/news/${item.slug}`} target="_blank">
                              <button
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                                title="View Public Page"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </Link>
                            <Link href={`/admin/news/${item.id}/edit`}>
                              <button
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary"
                                title="Edit Article"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground space-y-3">
              <Newspaper className="h-10 w-10 mx-auto text-muted-foreground/30" />
              <p>No articles created yet.</p>
              <Link href="/admin/news/new">
                <Button size="sm">Create First Article</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
