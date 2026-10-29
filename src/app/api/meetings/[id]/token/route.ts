import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/auth/session';
import { createMeetingToken } from '@/lib/livekit/token';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: meetingParam } = await params;
    const body = await request.json().catch(() => ({}));
    const requestedName = body.displayName?.trim();

    const supabase = await createClient();
    const currentProfile = await getCurrentProfile();

    // Query meeting by room_id or id
    const { data: meeting, error: meetError } = await supabase
      .from('meetings')
      .select('*')
      .or(`room_id.eq.${meetingParam},id.eq.${meetingParam}`)
      .single();

    if (meetError || !meeting) {
      return NextResponse.json(
        { error: 'The requested meeting room does not exist.' },
        { status: 404 }
      );
    }

    if (meeting.status === 'completed' || meeting.status === 'cancelled') {
      return NextResponse.json(
        { error: 'This meeting has already concluded or was cancelled.' },
        { status: 410 }
      );
    }

    // Check Access Policy
    const isStaff =
      currentProfile && ['super_admin', 'editor', 'moderator'].includes(currentProfile.role);
    const isMeetingHost = currentProfile && currentProfile.id === meeting.host_id;

    if (meeting.access_policy === 'members' && !currentProfile) {
      return NextResponse.json(
        { error: 'Authentication required. This session is reserved for registered members.' },
        { status: 401 }
      );
    }

    if (meeting.access_policy === 'restricted' && !isStaff && !isMeetingHost) {
      return NextResponse.json(
        { error: 'Restricted session. Access permitted by host invitation only.' },
        { status: 403 }
      );
    }

    const participantName =
      requestedName ||
      currentProfile?.full_name ||
      `Community Guest ${Math.floor(1000 + Math.random() * 9000)}`;

    const participantIdentity = currentProfile?.id || `guest-${Math.random().toString(36).substring(2, 10)}`;

    // Generate LiveKit token
    const tokenResult = await createMeetingToken({
      roomId: meeting.room_id,
      identity: participantIdentity,
      displayName: participantName,
      isHost: isMeetingHost || currentProfile?.role === 'super_admin',
    });

    // Record join in database
    if (tokenResult.token) {
      await supabase.from('meeting_participants').insert({
        meeting_id: meeting.id,
        user_id: currentProfile?.id || null,
        display_name: participantName,
        role: isMeetingHost ? 'host' : isStaff ? 'moderator' : 'participant',
      });
    }

    return NextResponse.json({
      success: true,
      token: tokenResult.token,
      serverUrl: tokenResult.serverUrl,
      isConfigured: tokenResult.isConfigured,
      error: tokenResult.error,
      meeting: {
        id: meeting.id,
        roomId: meeting.room_id,
        status: meeting.status,
        accessPolicy: meeting.access_policy,
        maxParticipants: meeting.max_participants,
      },
      participant: {
        name: participantName,
        isHost: isMeetingHost || currentProfile?.role === 'super_admin',
      },
    });
  } catch (err: any) {
    console.error('Error handling meeting token route:', err);
    return NextResponse.json(
      { error: 'Internal error generating meeting room token.' },
      { status: 500 }
    );
  }
}
