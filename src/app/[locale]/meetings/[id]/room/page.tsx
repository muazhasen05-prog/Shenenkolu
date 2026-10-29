import * as React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/auth/session';
import { LiveKitRoomComponent } from '@/components/meetings/LiveKitRoomComponent';

export const metadata = {
  title: 'Live Meeting Room | Shenen Kolu Woreda',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MeetingRoomPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id: roomId } = await params;
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  const { data: meeting } = await supabase
    .from('meetings')
    .select(`
      id,
      room_id,
      host_name,
      scheduled_start,
      duration_minutes,
      access_policy,
      status,
      max_participants,
      translations:meeting_translations (
        locale,
        title
      )
    `)
    .or(`room_id.eq.${roomId},id.eq.${roomId}`)
    .single();

  const initialMeeting = meeting
    ? {
        ...meeting,
        title: meeting.translations?.[0]?.title || meeting.room_id,
      }
    : { title: roomId, room_id: roomId };

  return (
    <LiveKitRoomComponent
      roomId={roomId}
      initialMeeting={initialMeeting}
      userProfile={profile}
    />
  );
}
