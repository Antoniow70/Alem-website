import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  const { data: projData, error: projError } = await supabase.from('projects').select('*').limit(1);
  console.log('Projects error:', projError ? projError.message : 'None');
  console.log('Projects count:', projData ? projData.length : 0);

  const { data: volData, error: volError } = await supabase.from('volunteers').select('*, activities(name)').limit(1);
  console.log('Volunteers query error:', volError ? volError.message : 'None');
  console.log('Volunteers count:', volData ? volData.length : 0);
  
  const { data: actData, error: actError } = await supabase.from('activities').select('*').limit(1);
  console.log('Activities error:', actError ? actError.message : 'None');
  console.log('Activities count:', actData ? actData.length : 0);
}

testFetch();
