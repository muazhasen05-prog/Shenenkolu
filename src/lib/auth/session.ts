import { createClient } from '@/lib/supabase/server';
import { Profile, UserRole } from '@/types/database';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      // Fallback profile if record hasn't synced yet
      return {
        id: user.id,
        email: user.email || '',
        full_name: (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'User',
        role: 'member',
        created_at: user.created_at,
        updated_at: user.created_at,
      };
    }

    return data as Profile;
  } catch {
    return null;
  }
}

export async function requireAuth(returnUrl: string = '/auth/login'): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect(returnUrl);
  }
  return profile;
}

export async function requireRole(
  allowedRoles: UserRole[],
  unauthorizedUrl: string = '/en'
): Promise<Profile> {
  const profile = await requireAuth();
  if (!allowedRoles.includes(profile.role)) {
    redirect(unauthorizedUrl);
  }
  return profile;
}
