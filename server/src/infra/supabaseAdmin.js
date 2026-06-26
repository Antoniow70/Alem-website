import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

const supabaseUrl = config.supabaseUrl;
const supabaseServiceRoleKey = config.supabaseServiceRoleKey;

if (!supabaseUrl) {
  console.error('Missing SUPABASE_URL/VITE_SUPABASE_URL in backend env configuration.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
