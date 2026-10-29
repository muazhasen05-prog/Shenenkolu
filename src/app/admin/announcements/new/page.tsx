'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Save, Globe, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function NewAnnouncementPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = React.useState<'en' | 'om' | 'am'>('en');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    priority: 'normal' as 'normal' | 'urgent',
    status: 'published' as 'draft' | 'published',
    is_pinned: false,
    expires_at: '',
    attachment_url: '',
    attachment_name: '',
    sendNotification: true,
    en: { title: '', body: '' },
    om: { title: '', body: '' },
    am: { title: '', body: '' },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!formData.en.title || !formData.en.body) {
      setErrorMessage('English title and body are required.');
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: annData, error: annError } = await supabase
        .from('announcements')
        .insert({
          priority: formData.priority,
          status: formData.status,
          is_pinned: formData.is_pinned,
          attachment_url: formData.attachment_url || null,
          attachment_name: formData.attachment_name || null,
          author_id: user?.id || null,
          published_at: new Date().toISOString(),
          expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        })
        .select()
        .single();

      if (annError) {
        setErrorMessage(annError.message);
        setIsLoading(false);
        return;
      }

      const annId = annData.id;

      const translations = [
        {
          announcement_id: annId,
          locale: 'en',
          title: formData.en.title,
          body: formData.en.body,
        },
        {
          announcement_id: annId,
          locale: 'om',
          title: formData.om.title || formData.en.title,
          body: formData.om.body || formData.en.body,
        },
        {
          announcement_id: annId,
          locale: 'am',
          title: formData.am.title || formData.en.title,
          body: formData.am.body || formData.en.body,
        },
      ];

      await supabase.from('announcement_translations').insert(translations);

      // Audit Log
      await supabase.from('audit_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'CREATE_ANNOUNCEMENT',
        entity_type: 'announcements',
        entity_id: annId,
        details: { title: formData.en.title, priority: formData.priority },
      });

      // Push Notification if enabled
      if (formData.sendNotification && formData.status === 'published') {
        fetch('/api/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `${formData.priority === 'urgent' ? 'URGENT: ' : 'Notice: '}${formData.en.title}`,
            message: formData.en.body.substring(0, 150),
            url: `/announcements`,
            category: 'announcement',
          }),
        }).catch(() => {});
      }

      setSuccessMessage('Announcement posted successfully!');
      setTimeout(() => {
        router.push('/admin/announcements');
      }, 1500);
    } catch {
      setErrorMessage('Failed to publish announcement.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/admin/announcements">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Announcements</span>
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-foreground">Post New Announcement</h2>
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

        {/* Translation Content */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-secondary" />
                <span>Notice Translations</span>
              </CardTitle>
              <div className="flex rounded-lg bg-muted p-1 gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`px-3 py-1 rounded-md ${
                    activeTab === 'en' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('om')}
                  className={`px-3 py-1 rounded-md ${
                    activeTab === 'om' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Afaan Oromoo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('am')}
                  className={`px-3 py-1 rounded-md ${
                    activeTab === 'am' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  አማርኛ
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {activeTab === 'en' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Notice Title (English) *
                  </label>
                  <Input
                    required
                    value={formData.en.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        en: { ...formData.en, title: e.target.value },
                      })
                    }
                    placeholder="E.g., Childhood Immunization Campaign"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Notice Body (English) *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.en.body}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        en: { ...formData.en, body: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter complete public advisory or notice text..."
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
                    placeholder="Mata duree beeksisaa..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Ibsa Beeksisaa (Afaan Oromoo)
                  </label>
                  <textarea
                    rows={5}
                    value={formData.om.body}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        om: { ...formData.om, body: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Qabiyyee beeksisaa..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'am' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    የማስታወቂያው ርዕስ (አማርኛ)
                  </label>
                  <Input
                    value={formData.am.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        am: { ...formData.am, title: e.target.value },
                      })
                    }
                    placeholder="የማስታወቂያውን ርዕስ በአማርኛ ያስገቡ"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    የማስታወቂያው ይዘት (አማርኛ)
                  </label>
                  <textarea
                    rows={5}
                    value={formData.am.body}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        am: { ...formData.am, body: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="ሙሉ የማስታወቂያውን ጽሁፍ እዚህ ይጻፉ..."
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority & Scheduling */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base">Priority & Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as 'normal' | 'urgent',
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="normal">Normal Public Notice</option>
                  <option value="urgent">Urgent Alert (Highlighted with banner)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Expiration Date</label>
                <Input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
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
                  <span>Pin Notice to Top</span>
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
                    <span>Send Push Notification</span>
                  </span>
                </label>
              </div>

              <Button type="submit" className="gap-2 shadow-sm font-semibold" isLoading={isLoading}>
                <Save className="h-4 w-4" />
                <span>Post Announcement</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
