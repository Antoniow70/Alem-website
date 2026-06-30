import dotenv from 'dotenv';
dotenv.config();

import { supabaseAdmin } from './infra/supabaseAdmin.js';

async function checkColumns() {
  try {
    console.log('Fetching 1 volunteer record...');
    const { data: vols, error: volError } = await supabaseAdmin
      .from('volunteers')
      .select('*')
      .limit(1);

    if (volError) {
      console.error('Error fetching volunteer:', volError);
    } else {
      console.log('Volunteer keys:', vols.length > 0 ? Object.keys(vols[0]) : 'No records found');
    }

    console.log('Fetching 1 message/support record...');
    const { data: msgs, error: msgError } = await supabaseAdmin
      .from('messages')
      .select('*')
      .limit(1);

    if (msgError) {
      console.error('Error fetching message:', msgError);
    } else {
      console.log('Message keys:', msgs.length > 0 ? Object.keys(msgs[0]) : 'No records found');
    }

    console.log('Fetching 1 team record...');
    const { data: team, error: teamError } = await supabaseAdmin
      .from('team')
      .select('*')
      .limit(1);

    if (teamError) {
      console.error('Error fetching team:', teamError);
    } else {
      console.log('Team keys:', team.length > 0 ? Object.keys(team[0]) : 'No records found');
    }

  } catch (err) {
    console.error('Error in checkColumns:', err);
  }
}

checkColumns();
