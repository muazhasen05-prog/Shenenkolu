'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Save, Globe, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { slugify } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function NewNewsArticlePage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = React.useState<'en' | 'om' | 'am'>('en');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Form State
  const [formData, setFormData] = React.useState({
    slug: '',
    category: 'Agriculture & Rural Development',
    featured_image: '',
    status: 'published' as 'draft' | 'scheduled' | 'published',
    is_featured: false,
    is_pinned: false,
    sendNotification: true,
    en: { title: '', excerpt: '', body: '' },
    om: { title: '', excerpt: '', body: '' },
    am: { title: '', excerpt: '', body: '' },
  });

  const handleEnTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      en: { ...prev.en, title: val },
      slug: prev.slug || slugify(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!formData.en.title) {
      setErrorMessage('English title is required.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // 2. Insert into news
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .insert({
          slug: formData.slug || slugify(formData.en.title),
          category: formData.category,
          featured_image: formData.featured_image,
          status: formData.status,
          is_featured: formData.is_featured,
          is_pinned: formData.is_pinned,
          author_id: user?.id || null,
          author_name: user?.user_metadata?.full_name || 'Staff Editor',
          published_at: formData.status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (newsError) {
        setErrorMessage(newsError.message);
        setIsLoading(false);
        return;
      }

      const newsId = newsData.id;

      // 3. Insert translations (en, om, am)
      const translationsToInsert = [
        {
          news_id: newsId,
          locale: 'en',
          title: formData.en.title,
          excerpt: formData.en.excerpt,
          body: formData.en.body,
        },
        {
          news_id: newsId,
          locale: 'om',
          title: formData.om.title || formData.en.title,
          excerpt: formData.om.excerpt || formData.en.excerpt,
          body: formData.om.body || formData.en.body,
        },
        {
          news_id: newsId,
          locale: 'am',
          title: formData.am.title || formData.en.title,
          excerpt: formData.am.excerpt || formData.en.excerpt,
          body: formData.am.body || formData.en.body,
        },
      ];

      await supabase.from('news_translations').insert(translationsToInsert);

      // 4. Record audit log
      await supabase.from('audit_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'CREATE_NEWS_ARTICLE',
        entity_type: 'news',
        entity_id: newsId,
        details: { title: formData.en.title, slug: formData.slug },
      });

      // 5. Send push notification if enabled and article is published
      if (formData.sendNotification && formData.status === 'published') {
        fetch('/api/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `News: ${formData.en.title}`,
            message: formData.en.excerpt || 'Read the full report from Shenen Kolu Woreda.',
            url: `/news/${formData.slug}`,
            category: 'news',
          }),
        }).catch(() => {});
      }

      setSuccessMessage('Article published successfully! Redirecting...');
      setTimeout(() => {
        router.push('/admin/news');
      }, 1500);
    } catch {
      setErrorMessage('An unexpected error occurred while saving the article.');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    'Agriculture & Rural Development',
    'Infrastructure & Water',
    'Education & Youth Empowerment',
    'Civic Assembly & Good Governance',
    'Health & Community Welfare',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/admin/news">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Articles</span>
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-foreground">Create New Article</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Multilingual Tabs */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>Multilingual Translations</span>
              </CardTitle>
              <div className="flex rounded-lg bg-muted p-1 gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeTab === 'en' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('om')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeTab === 'om' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Afaan Oromoo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('am')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeTab === 'am' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  አማርኛ (Amharic)
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {activeTab === 'en' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Headline (English) *
                  </label>
                  <Input
                    required
                    value={formData.en.title}
                    onChange={(e) => handleEnTitleChange(e.target.value)}
                    placeholder="Enter article title in English"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Short Excerpt (English)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.en.excerpt}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        en: { ...formData.en, excerpt: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Brief 1-2 sentence preview"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Full Content Body (English) *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.en.body}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        en: { ...formData.en, body: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Write full article body text..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'om' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Mata Duree (Afaan Oromoo)
                  </label>
                  <Input
                    value={formData.om.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        om: { ...formData.om, title: e.target.value },
                      })
                    }
                    placeholder="Mata duree Afaan Oromootiin galchaa"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Cuunfaa (Afaan Oromoo)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.om.excerpt}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        om: { ...formData.om, excerpt: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Ibsa gabaabaa..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Qabiyyee Guutuu (Afaan Oromoo)
                  </label>
                  <textarea
                    rows={6}
                    value={formData.om.body}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        om: { ...formData.om, body: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Barreeffama oduu guutuu..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'am' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    ርዕስ (አማርኛ)
                  </label>
                  <Input
                    value={formData.am.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        am: { ...formData.am, title: e.target.value },
                      })
                    }
                    placeholder="የዜናውን ርዕስ በአማርኛ ያስገቡ"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    አጭር ማጠቃለያ (አማርኛ)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.am.excerpt}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        am: { ...formData.am, excerpt: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="አጭር ማጠቃለያ..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    ሙሉ ይዘት (አማርኛ)
                  </label>
                  <textarea
                    rows={6}
                    value={formData.am.body}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        am: { ...formData.am, body: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="ሙሉውን የዜና ዘገባ እዚህ ይጻፉ..."
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Publishing & Metadata Configuration */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base">Metadata & Publishing</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Publishing Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'draft' | 'scheduled' | 'published',
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="published">Published (Visible immediately)</option>
                  <option value="draft">Draft (Internal review)</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">
                Featured Cover Image URL
              </label>
              <Input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">URL Slug</label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="article-url-slug"
              />
            </div>

            <div className="pt-2 border-t border-border flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_pinned}
                    onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-primary"
                  />
                  <span>Pin Article to Top</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-foreground font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sendNotification}
                    onChange={(e) =>
                      setFormData({ ...formData, sendNotification: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-input text-primary"
                  />
                  <span className="flex items-center gap-1">
                    <Send className="h-3.5 w-3.5 text-primary" />
                    <span>Send Web Push Alert</span>
                  </span>
                </label>
              </div>

              <Button type="submit" className="gap-2 shadow-sm font-semibold" isLoading={isLoading}>
                <Save className="h-4 w-4" />
                <span>Publish Article</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
