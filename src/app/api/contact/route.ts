import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import { createAdminClient } from '@/lib/supabase/admin';

// In-memory IP rate limiter for zero-cost operation (max 5 submissions per hour per IP)
const ipSubmissionTracker = new Map<string, number[]>();

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown-ip';

    // Rate limiting check: 5 per hour
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const timestamps = (ipSubmissionTracker.get(ip) || []).filter((t) => now - t < windowMs);

    if (timestamps.length >= 5) {
      return NextResponse.json(
        { error: 'Too many submissions from this connection. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = contactFormSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid input fields', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Record submission timestamp
    timestamps.push(now);
    ipSubmissionTracker.set(ip, timestamps);

    // Save to database
    try {
      const admin = createAdminClient();
      await admin.from('contact_messages').insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        status: 'unread',
        ip_address: ip,
      });
    } catch (dbErr) {
      console.warn('Could not persist contact message to database (development fallback):', dbErr);
    }

    return NextResponse.json({ success: true, message: 'Message recorded successfully' });
  } catch (err) {
    console.error('Contact form submission exception:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your message.' },
      { status: 500 }
    );
  }
}
