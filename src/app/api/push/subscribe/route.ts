import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { pushSubscriptionSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = pushSubscriptionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 });
    }

    const { endpoint, keys } = parseResult.data;
    const user = await getCurrentUser();
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const admin = createAdminClient();

    const { error } = await admin.from('push_subscriptions').upsert(
      {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        user_id: user?.id || null,
        user_agent: userAgent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'endpoint' }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscription recording error:', err);
    return NextResponse.json({ error: 'Failed to record subscription' }, { status: 500 });
  }
}
