'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const supabase = createClient();

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setSuccessMessage(
          'Registration submitted successfully! If email confirmation is required, please check your inbox to activate your account.'
        );
      }
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
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('registerTitle')}</CardTitle>
          <CardDescription>{tCommon('siteName')}</CardDescription>
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
            <form onSubmit={handleRegister} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-semibold text-foreground">{t('fullName')}</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Abebe Bikila"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-foreground">{t('email')}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-foreground">{t('password')}</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-foreground">{t('confirmPassword')}</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" className="w-full mt-2 font-semibold" isLoading={isLoading}>
                {t('submitRegister')}
              </Button>

              <div className="text-center pt-2">
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                  {t('haveAccount')}
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
