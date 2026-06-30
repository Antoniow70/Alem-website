import dotenv from 'dotenv';
dotenv.config({ path: 'server/.env' });

import { createTeamMember, getTeam } from '../server/src/modules/equipa/equipa.service.js';

async function testTeam() {
  try {
    console.log('Fetching team...');
    const list = await getTeam();
    console.log('Current team size:', list.length);

    console.log('Testing createTeamMember...');
    const result = await createTeamMember({
      name: 'Test Member',
      role: 'Tester',
      bio: 'Testing if it saves',
      photo_url: '',
      sort_order: 0
    });
    console.log('Created successfully:', result);
  } catch (err) {
    console.error('Error in testTeam:', err);
  }
}

testTeam();
