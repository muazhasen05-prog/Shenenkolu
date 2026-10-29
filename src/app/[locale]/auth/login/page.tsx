'use client';

import * as React from 'react';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Check user role from profile to determine redirection
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile && ['super_admin', 'editor', 'moderator'].includes(profile.role)) {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
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
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('loginTitle')}</CardTitle>
          <CardDescription>{tCommon('siteName')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="name@shenenkolu.gov.et"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">{t('password')}</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full mt-2 font-semibold" isLoading={isLoading}>
              {t('submitLogin')}
            </Button>

            <div className="text-center pt-2">
              <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-foreground">
                {t('noAccount')}
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-border/80 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-foreground">Super Admin Credentials:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@shenenkolu.gov.et');
                    setPassword('SecureInitialPassword123!');
                  }}
                  className="text-primary hover:underline font-bold text-xs"
                >
                  Fill Credentials
                </button>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground break-all">
                admin@shenenkolu.gov.et / SecureInitialPassword123!
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
