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

const USER_ID = 'e1059cca-ea90-462e-b341-e789a417ff49'; // admin@alem.mz ID
const NEW_PASSWORD = 'admin123'; // New password to set

async function run() {
  try {
    console.log(`Attempting to reset password for user ID: ${USER_ID} (admin@alem.mz)...`);
    const { data, error } = await supabase.auth.admin.updateUserById(
      USER_ID,
      { password: NEW_PASSWORD }
    );
    
    if (error) {
      console.error('Error updating password:', error.message);
      return;
    }
    
    console.log('Successfully updated password for admin@alem.mz!');
    console.log(`Email: admin@alem.mz`);
    console.log(`Password is now: ${NEW_PASSWORD}`);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
