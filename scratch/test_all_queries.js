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
  console.log('Testing each query in fetchAllAdminData...');
  
  const queries = [
    { name: 'projects', run: () => supabase.from('projects').select('*').order('created_at', { ascending: false }) },
    { name: 'volunteers', run: () => supabase.from('volunteers').select('*, activities(name)').order('created_at', { ascending: false }) },
    { name: 'messages', run: () => supabase.from('messages').select('*').order('created_at', { ascending: false }) },
    { name: 'beneficiary_stories', run: () => supabase.from('beneficiary_stories').select('*').order('created_at', { ascending: false }) },
    { name: 'team', run: () => supabase.from('team').select('*').order('created_at', { ascending: false }) },
    { name: 'partners', run: () => supabase.from('partners').select('*').order('created_at', { ascending: false }) },
    { name: 'donations', run: () => supabase.from('donations').select('*').order('created_at', { ascending: false }) }
  ];

  for (const q of queries) {
    try {
      const { data, error } = await q.run();
      if (error) {
        console.error(`❌ Query "${q.name}" failed:`, error.message);
      } else {
        console.log(`✅ Query "${q.name}" succeeded (count: ${data.length})`);
      }
    } catch (err) {
      console.error(`❌ Query "${q.name}" caught error:`, err.message);
    }
  }
}

testFetch();
