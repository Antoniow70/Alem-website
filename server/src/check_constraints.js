import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkConstraints() {
  try {
    // We can run a SQL query through postgres functions or RPC if available,
    // or try querying pg_catalog tables using RPC (if postgrest allows it).
    // Usually, postgrest doesn't allow direct SELECT on pg_constraint unless it's exposed.
    // Let's try querying information_schema if postgrest has exposed it.
    const { data, error } = await supabase
      .from('pg_constraint')
      .select('*');
    if (error) {
      console.log('Direct pg_constraint query error (as expected):', error.message);
      
      // Let's try executing raw SQL if there is an RPC endpoint like 'exec_sql'
      const { data: rpcData, error: rpcError } = await supabase.rpc('exec_sql', {
        sql_query: "SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'messages'::regclass;"
      });
      if (rpcError) {
        console.log('exec_sql RPC error:', rpcError.message);
        
        // Since we cannot run SQL directly, let's fetch a list of existing messages to see what status they have.
        const { data: msgData, error: msgError } = await supabase
          .from('messages')
          .select('status')
          .limit(5);
        if (msgError) {
          console.log('Error fetching messages:', msgError.message);
        } else {
          console.log('Existing messages status:', msgData);
        }
      } else {
        console.log('Constraints details via exec_sql:', rpcData);
      }
    } else {
      console.log('pg_constraint data:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkConstraints();
