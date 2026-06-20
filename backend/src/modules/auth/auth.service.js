import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function login(email, password) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logout(token) {
  // Supabase signout requires client/admin role
  const { error } = await supabaseAdmin.auth.signOut();
  if (error) throw error;
}
