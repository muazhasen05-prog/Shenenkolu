'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

export default function ContactPage() {
  const t = useTranslations('contact');
  const tCommon = useTranslations('common');

  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || t('errorMsg'));
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch {
      setErrorMessage(t('errorMsg'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
            <Mail className="h-4 w-4" />
            <span>{t('title')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t('title')}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 sm:p-8">
                {success ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {t('successMsg')}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Our woreda administration communications team will review your inquiry and follow up accordingly.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSuccess(false)}
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">
                          {t('nameLabel')} *
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          placeholder="Your Name"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">
                          {t('emailLabel')} *
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">
                          {t('phoneLabel')}
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+251 90 000 0000"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-foreground">
                          {t('subjectLabel')} *
                        </label>
                        <Input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                          placeholder="Topic of inquiry"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-foreground">
                        {t('messageLabel')} *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Write your message here..."
                      />
                    </div>

                    <Button type="submit" className="gap-2" isLoading={isLoading}>
                      <Send className="h-4 w-4" />
                      <span>{isLoading ? t('sendingBtn') : t('sendBtn')}</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Details & Office Hours */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-bold text-lg text-foreground">
                {t('addressTitle')}
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{t('addressDetails')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span>info@shenenkolu.gov.et</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>+251 11 000 0000</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base text-foreground">
                  {t('officeHours')}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('officeHoursDetails')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
