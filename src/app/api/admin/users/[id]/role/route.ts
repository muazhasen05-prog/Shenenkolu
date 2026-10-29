import { NextResponse } from 'next/server';
import { getCurrentProfile } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { UserRole } from '@/types/database';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const currentProfile = await getCurrentProfile();

    if (!currentProfile || currentProfile.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden: Super Administrator clearance required.' },
        { status: 403 }
      );
    }

    // Prevent changing own role
    if (currentProfile.id === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot modify your own administrator role.' },
        { status: 400 }
      );
    }

    const { role } = (await request.json()) as { role: UserRole };
    const validRoles: UserRole[] = ['super_admin', 'editor', 'moderator', 'member'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Update profile
    const { error: updateError } = await admin
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', targetUserId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Record audit log
    await admin.from('audit_logs').insert({
      actor_id: currentProfile.id,
      actor_email: currentProfile.email,
      action: 'UPDATE_USER_ROLE',
      entity_type: 'profiles',
      entity_id: targetUserId,
      details: { newRole: role, updatedBy: currentProfile.email },
    });

    return NextResponse.json({ success: true, newRole: role });
  } catch (err) {
    console.error('Error updating user role:', err);
    return NextResponse.json(
      { error: 'Internal server error while updating role.' },
      { status: 500 }
    );
  }
}
