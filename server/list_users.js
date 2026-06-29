import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

async function run() {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('Error listing users:', error.message);
      return;
    }
    console.log('Registered Users:');
    users.forEach(user => {
      console.log(`- Email: ${user.email}, ID: ${user.id}, Role: ${user.role}, Last Sign In: ${user.last_sign_in_at}`);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
