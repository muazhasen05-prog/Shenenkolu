'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function NotificationBroadcastForm() {
  const [formData, setFormData] = React.useState({
    title: '',
    message: '',
    url: '/',
    category: 'news' as 'news' | 'announcement' | 'meeting' | 'system',
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send broadcast');
        setIsLoading(false);
        return;
      }

      setSuccess(
        `Alert dispatched to ${data.deliveredCount || 0} active subscriber(s).`
      );
      setFormData({
        title: '',
        message: '',
        url: '/',
        category: 'news',
      });
    } catch {
      setError('An error occurred during push broadcast.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleBroadcast} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">Alert Title *</label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="E.g., Emergency Kebele Consultation"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">Notification Message *</label>
        <textarea
          required
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
          placeholder="Brief message shown in browser push banner..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Click Destination URL</label>
          <Input
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="/news or /meetings"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as 'news' | 'announcement' | 'meeting' | 'system',
              })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
          >
            <option value="news">News Update</option>
            <option value="announcement">Urgent Announcement</option>
            <option value="meeting">Online Town Hall Meeting</option>
            <option value="system">System Notification</option>
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full gap-2 font-semibold" isLoading={isLoading}>
        <Send className="h-4 w-4" />
        <span>Dispatch Notification</span>
      </Button>
    </form>
  );
}
