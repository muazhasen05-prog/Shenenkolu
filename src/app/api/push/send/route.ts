import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendPushBroadcastSchema } from '@/lib/validations';
import { getCurrentProfile } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile || !['super_admin', 'editor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const parseResult = sendPushBroadcastSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid notification payload' }, { status: 400 });
    }

    const { title, message, url, category } = parseResult.data;

    // Configure WebPush with VAPID
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:info@shenenkolu.gov.et';

    if (!publicKey || !privateKey) {
      console.warn('VAPID keys not configured; saving notification record only.');
      return NextResponse.json({
        success: true,
        sent: 0,
        warning: 'VAPID keys not configured on server.',
      });
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);

    const admin = createAdminClient();

    // Query active subscriptions
    const { data: subscriptions } = await admin.from('push_subscriptions').select('*');

    let deliveredCount = 0;
    const payload = JSON.stringify({
      title,
      body: message,
      url,
      category,
    });

    if (subscriptions && subscriptions.length > 0) {
      const deliveryPromises = subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          );
          deliveredCount++;
        } catch (err: any) {
          // If subscription has expired or unsubscribed, remove from database
          if (err.statusCode === 410 || err.statusCode === 404) {
            await admin.from('push_subscriptions').delete().eq('id', sub.id);
          }
        }
      });

      await Promise.allSettled(deliveryPromises);
    }

    // Record notification in notifications history
    await admin.from('notifications').insert({
      title,
      message,
      url,
      category,
      sent_by: profile.id,
      delivered_count: deliveredCount,
    });

    // Record audit log
    await admin.from('audit_logs').insert({
      actor_id: profile.id,
      actor_email: profile.email,
      action: 'SEND_PUSH_BROADCAST',
      entity_type: 'notifications',
      details: { title, deliveredCount, totalSubscribers: subscriptions?.length || 0 },
    });

    return NextResponse.json({
      success: true,
      deliveredCount,
      totalSubscribers: subscriptions?.length || 0,
    });
  } catch (err) {
    console.error('Push delivery error:', err);
    return NextResponse.json({ error: 'Failed to broadcast notification' }, { status: 500 });
  }
}
