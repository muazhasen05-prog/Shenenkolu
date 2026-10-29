import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const { endpoint } = await request.json();
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    const admin = createAdminClient();
    await admin.from('push_subscriptions').delete().eq('endpoint', endpoint);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return NextResponse.json({ error: 'Failed to delete subscription' }, { status: 500 });
  }
}
