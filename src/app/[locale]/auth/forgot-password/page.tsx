'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const supabase = createClient();

  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/api/auth/callback?next=/auth/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Password reset instructions have been sent to your email address.');
    } catch {
      setErrorMessage(tCommon('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <KeyRound className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('forgotPassword')}</CardTitle>
          <CardDescription>Enter your email address to receive password reset instructions.</CardDescription>
        </CardHeader>

        <CardContent>
          {successMessage ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm text-foreground">{successMessage}</p>
              <Link href="/auth/login" className="inline-block pt-2">
                <Button>{t('submitLogin')}</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-semibold text-foreground">{t('email')}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full mt-2 font-semibold" isLoading={isLoading}>
                {tCommon('submit')}
              </Button>

              <div className="text-center pt-2">
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                  {tCommon('back')} &rarr; {t('submitLogin')}
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
