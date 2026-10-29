import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const platform = request.headers.get('sec-ch-ua-platform') || 'browser';

    const admin = createAdminClient();
    await admin.from('pwa_installs').insert({
      user_agent: userAgent,
      platform,
      installed_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 200 }); // non-blocking
  }
}
