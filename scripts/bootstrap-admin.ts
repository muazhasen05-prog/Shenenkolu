/**
 * First Super Administrator Bootstrap Script
 *
 * This privileged CLI script securely initializes or upgrades the primary
 * super-administrator account using the server-side Supabase Service Role key.
 *
 * Usage:
 *   npx tsx scripts/bootstrap-admin.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
const adminFullName = process.env.INITIAL_ADMIN_FULL_NAME || 'System Administrator';

async function bootstrap() {
  console.log('--- Shenen Kolu Woreda Prosperity Party: Admin Bootstrap ---');

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
    process.exit(1);
  }

  if (!adminEmail || !adminPassword) {
    console.error('Error: INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be configured.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`Checking for existing user account: ${adminEmail}...`);

  // 1. Check if user already exists
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Failed to query users via service role:', listError.message);
    process.exit(1);
  }

  const existingUser = usersData.users.find(
    (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
  );

  let userId: string;

  if (existingUser) {
    console.log(`User found with ID: ${existingUser.id}. Promoting to super_admin...`);
    userId = existingUser.id;
  } else {
    console.log(`Creating new user account for ${adminEmail}...`);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminFullName,
      },
    });

    if (createError || !newUser.user) {
      console.error('Failed to create admin user:', createError?.message);
      process.exit(1);
    }

    userId = newUser.user.id;
    console.log(`User created successfully with ID: ${userId}`);
  }

  // 2. Upsert profile with super_admin role
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: adminEmail,
      full_name: adminFullName,
      role: 'super_admin',
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    console.error('Failed to set super_admin role in profiles:', profileError.message);
    process.exit(1);
  }

  // 3. Record audit log
  await supabase.from('audit_logs').insert({
    actor_id: userId,
    actor_email: adminEmail,
    action: 'BOOTSTRAP_SUPER_ADMIN',
    entity_type: 'profiles',
    entity_id: userId,
    details: { bootstrapMethod: 'CLI', email: adminEmail },
  });

  console.log('✅ Super Administrator initialized successfully!');
  console.log(`Email: ${adminEmail}`);
  console.log('Role:  super_admin');
  console.log('You can now log in at /en/auth/login and access /admin.');
}

bootstrap().catch((err) => {
  console.error('Unhandled bootstrap exception:', err);
  process.exit(1);
});
