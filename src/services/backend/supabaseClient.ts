import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { settingsRepository } from '../../repositories/settingsRepository';

export interface BackendConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  source: 'runtime' | 'env' | 'global' | 'none';
}

const GLOBAL_SUPABASE_URL = 'https://owggyopbuftjtfgqinto.supabase.co';
const GLOBAL_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_BbW0CqfCcdFXswTVgizCIg_I8t0iQ0R';

let client: SupabaseClient | null = null;
let clientSignature = '';

export function getBackendConfig(): BackendConfig {
  const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const envAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (envUrl.length > 0 && envAnonKey.length > 0) {
    return {
      supabaseUrl: envUrl,
      supabaseAnonKey: envAnonKey,
      source: 'env',
    };
  }

  const settings = settingsRepository.getAll();
  const runtimeUrl = settings.supabaseUrl.trim();
  const runtimeAnonKey = settings.supabaseAnonKey.trim();
  if (runtimeUrl.length > 0 && runtimeAnonKey.length > 0) {
    return {
      supabaseUrl: runtimeUrl,
      supabaseAnonKey: runtimeAnonKey,
      source: 'runtime',
    };
  }

  if (GLOBAL_SUPABASE_URL.length > 0 && GLOBAL_SUPABASE_PUBLISHABLE_KEY.length > 0) {
    return {
      supabaseUrl: GLOBAL_SUPABASE_URL,
      supabaseAnonKey: GLOBAL_SUPABASE_PUBLISHABLE_KEY,
      source: 'global',
    };
  }

  return {
    supabaseUrl: '',
    supabaseAnonKey: '',
    source: 'none',
  };
}

export function isBackendConfigured(): boolean {
  const config = getBackendConfig();
  return config.supabaseUrl.length > 0 && config.supabaseAnonKey.length > 0;
}

export function resetSupabaseClient(): void {
  client = null;
  clientSignature = '';
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getBackendConfig();
  if (config.supabaseUrl.length === 0 || config.supabaseAnonKey.length === 0) return null;

  const signature = `${config.supabaseUrl}|${config.supabaseAnonKey}`;
  if (client && clientSignature === signature) return client;

  clientSignature = signature;
  client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });
  return client;
}
