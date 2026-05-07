import { Session, User } from '@supabase/supabase-js';
import { settingsRepository } from '../../repositories/settingsRepository';
import { getSupabaseClient, isBackendConfigured } from './supabaseClient';

export type CloudRole = 'student' | 'admin';

export interface CloudProfile {
  user_id: string;
  display_name: string;
  role: CloudRole;
  xp_total: number;
  coins_total: number;
  chests_opened: number;
  level: number;
}

export interface AuthResult {
  ok: boolean;
  message: string;
  user?: User;
}

export async function getCloudSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getCloudUser(): Promise<User | null> {
  return (await getCloudSession())?.user ?? null;
}

export async function getCloudProfile(): Promise<CloudProfile | null> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, display_name, role, xp_total, coins_total, chests_opened, level')
    .eq('user_id', user.id)
    .maybeSingle<CloudProfile>();

  if (error) throw error;
  return data ?? null;
}

export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthResult> {
  const supabase = getSupabaseClient();
  if (!supabase || !isBackendConfigured()) {
    return { ok: false, message: 'Cloud sync is not configured yet. Guest mode still works.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });
  if (error) return { ok: false, message: error.message };

  if (data.user) {
    await upsertCloudProfile(displayName);
  }

  return {
    ok: true,
    message: data.session
      ? 'Account created. Syncing your local progress now.'
      : 'Account created. Check your email if confirmation is enabled, then sign in.',
    user: data.user ?? undefined,
  };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabaseClient();
  if (!supabase || !isBackendConfigured()) {
    return { ok: false, message: 'Cloud sync is not configured yet. Guest mode still works.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: error.message };

  await upsertCloudProfile(settingsRepository.getAll().profileName);
  return { ok: true, message: 'Signed in. Syncing your progress now.', user: data.user };
}

export async function signOutCloud(): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function upsertCloudProfile(displayName: string): Promise<void> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user) return;

  const cleanName = displayName.trim().slice(0, 80) || 'NeuroMath Explorer';
  const { error } = await supabase.from('profiles').upsert(
    {
      user_id: user.id,
      display_name: cleanName,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  if (error) throw error;
}

export async function claimCloudAdminWithCode(code: string): Promise<AuthResult> {
  const supabase = getSupabaseClient();
  if (!supabase || !isBackendConfigured()) {
    return { ok: false, message: 'Cloud sync is not configured yet. Save Supabase setup first.' };
  }

  const user = await getCloudUser();
  if (!user) {
    return { ok: false, message: 'Sign in first, then enter the superuser code.' };
  }

  await upsertCloudProfile(settingsRepository.getAll().profileName);
  const { data, error } = await supabase.rpc('claim_admin_with_code', {
    claim_code: code.trim(),
  });
  if (error) return { ok: false, message: error.message };

  return {
    ok: true,
    message: typeof data === 'string' ? data : 'Superuser role enabled for this cloud account.',
    user,
  };
}

export async function isCloudAdmin(): Promise<boolean> {
  const profile = await getCloudProfile();
  return profile?.role === 'admin';
}
