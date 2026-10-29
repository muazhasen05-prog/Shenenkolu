import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentProfile } from '@/lib/auth/session';
import { MeetingStatus } from '@/types/database';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: meetingParam } = await params;
    const currentProfile = await getCurrentProfile();

    if (!currentProfile) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { status } = (await request.json()) as { status: MeetingStatus };
    const validStatuses: MeetingStatus[] = ['scheduled', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid meeting status' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verify target meeting
    const { data: meeting } = await admin
      .from('meetings')
      .select('*')
      .or(`room_id.eq.${meetingParam},id.eq.${meetingParam}`)
      .single();

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const isHost = meeting.host_id === currentProfile.id;
    const isSuperAdmin = currentProfile.role === 'super_admin';
    const isStaff = ['super_admin', 'editor', 'moderator'].includes(currentProfile.role);

    if (!isHost && !isSuperAdmin && !isStaff) {
      return NextResponse.json(
        { error: 'Only the meeting host or administration staff can alter room state.' },
        { status: 403 }
      );
    }

    await admin
      .from('meetings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', meeting.id);

    // Audit log
    await admin.from('audit_logs').insert({
      actor_id: currentProfile.id,
      actor_email: currentProfile.email,
      action: 'UPDATE_MEETING_STATUS',
      entity_type: 'meetings',
      entity_id: meeting.id,
      details: { newStatus: status, roomId: meeting.room_id },
    });

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error('Error changing meeting status:', err);
    return NextResponse.json({ error: 'Failed to update meeting status' }, { status: 500 });
  }
}
