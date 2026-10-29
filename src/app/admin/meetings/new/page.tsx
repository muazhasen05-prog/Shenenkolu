'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ArrowLeft, Save, Globe, Video, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function NewMeetingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = React.useState<'en' | 'om' | 'am'>('en');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState({
    room_id: `shenen-kolu-${Math.random().toString(36).substring(2, 8)}`,
    scheduled_start: '',
    duration_minutes: 60,
    access_policy: 'public' as 'public' | 'members' | 'restricted',
    max_participants: 50,
    sendNotification: true,
    en: { title: '', description: '' },
    om: { title: '', description: '' },
    am: { title: '', description: '' },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!formData.en.title) {
      setErrorMessage('English meeting title is required.');
      setIsLoading(false);
      return;
    }

    if (!formData.scheduled_start) {
      setErrorMessage('Scheduled start date and time are required.');
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: meetData, error: meetError } = await supabase
        .from('meetings')
        .insert({
          room_id: formData.room_id.toLowerCase().trim(),
          host_id: user?.id || null,
          host_name: user?.user_metadata?.full_name || 'Woreda Secretariat',
          scheduled_start: new Date(formData.scheduled_start).toISOString(),
          duration_minutes: Number(formData.duration_minutes),
          access_policy: formData.access_policy,
          status: 'scheduled',
          max_participants: Number(formData.max_participants),
        })
        .select()
        .single();

      if (meetError) {
        setErrorMessage(meetError.message);
        setIsLoading(false);
        return;
      }

      const meetId = meetData.id;

      const translations = [
        {
          meeting_id: meetId,
          locale: 'en',
          title: formData.en.title,
          description: formData.en.description,
        },
        {
          meeting_id: meetId,
          locale: 'om',
          title: formData.om.title || formData.en.title,
          description: formData.om.description || formData.en.description,
        },
        {
          meeting_id: meetId,
          locale: 'am',
          title: formData.am.title || formData.en.title,
          description: formData.am.description || formData.en.description,
        },
      ];

      await supabase.from('meeting_translations').insert(translations);

      // Audit Log
      await supabase.from('audit_logs').insert({
        actor_id: user?.id,
        actor_email: user?.email,
        action: 'SCHEDULE_MEETING',
        entity_type: 'meetings',
        entity_id: meetId,
        details: { title: formData.en.title, room_id: formData.room_id },
      });

      // Send push notification if enabled
      if (formData.sendNotification && formData.access_policy === 'public') {
        fetch('/api/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Town Hall Meeting Scheduled: ${formData.en.title}`,
            message: `Starts on ${new Date(formData.scheduled_start).toLocaleDateString()}. Join the live community forum.`,
            url: `/meetings/${formData.room_id}/room`,
            category: 'meeting',
          }),
        }).catch(() => {});
      }

      setSuccessMessage('Meeting session scheduled successfully!');
      setTimeout(() => {
        router.push('/admin/meetings');
      }, 1500);
    } catch {
      setErrorMessage('Failed to schedule meeting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/admin/meetings">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Meetings</span>
          </Button>
        </Link>
        <h2 className="text-xl font-bold text-foreground">Schedule Meeting / Town Hall</h2>
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

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>Session Titles & Descriptions</span>
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
                    Meeting Title (English) *
                  </label>
                  <Input
                    required
                    value={formData.en.title}
                    onChange={(e) =>
                      setFormData({ ...formData, en: { ...formData.en, title: e.target.value } })
                    }
                    placeholder="Woreda Agricultural Consultation"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Description & Agenda (English)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.en.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        en: { ...formData.en, description: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Outline discussion points and agenda..."
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
                      setFormData({ ...formData, om: { ...formData.om, title: e.target.value } })
                    }
                    placeholder="Mata duree walga'ii..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    Ibsa fi Ajandaa (Afaan Oromoo)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.om.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        om: { ...formData.om, description: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Ajandaalee marii..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'am' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    የስብሰባው ርዕስ (አማርኛ)
                  </label>
                  <Input
                    value={formData.am.title}
                    onChange={(e) =>
                      setFormData({ ...formData, am: { ...formData.am, title: e.target.value } })
                    }
                    placeholder="የስብሰባውን ርዕስ በአማርኛ ያስገቡ"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">
                    ዝርዝር እና አጀንዳ (አማርኛ)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.am.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        am: { ...formData.am, description: e.target.value },
                      })
                    }
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="የስብሰባውን አጀንዳ እዚህ ያብራሩ..."
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Room Parameters */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-base">Room Parameters & Security Policy</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Room Identifier</label>
                <Input
                  type="text"
                  required
                  value={formData.room_id}
                  onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Access Policy</label>
                <select
                  value={formData.access_policy}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      access_policy: e.target.value as 'public' | 'members' | 'restricted',
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="public">Open to Public</option>
                  <option value="members">Members Only</option>
                  <option value="restricted">Restricted (Invitation only)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Scheduled Start Time (Addis Ababa Time) *
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={formData.scheduled_start}
                  onChange={(e) => setFormData({ ...formData, scheduled_start: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Duration (Minutes)
                </label>
                <Input
                  type="number"
                  min={10}
                  max={240}
                  value={formData.duration_minutes}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_minutes: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-end">
              <Button type="submit" className="gap-2 shadow-sm font-semibold" isLoading={isLoading}>
                <Save className="h-4 w-4" />
                <span>Save & Schedule Session</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
