import dotenv from 'dotenv';
dotenv.config();

import { submitVolunteer } from './modules/voluntarios/voluntarios.service.js';
import { submitMessage } from './modules/suporte/suporte.service.js';
import { supabaseAdmin } from './infra/supabaseAdmin.js';

async function testSubmissions() {
  console.log('--- TESTING VOLUNTEER SUBMISSION ---');
  try {
    const { data: activities, error: actError } = await supabaseAdmin
      .from('activities')
      .select('id, name')
      .limit(1);

    if (actError) {
      console.error('Error fetching activities:', actError);
    } else if (!activities || activities.length === 0) {
      console.log('⚠️ No activities found.');
    } else {
      const activityId = activities[0].id;
      console.log(`Using activity "${activities[0].name}" (ID: ${activityId})`);
      const volResult = await submitVolunteer({
        full_name: 'Test Volunteer',
        email: 'testvol@example.com',
        phone: '123456789',
        genero: 'Masculino',
        endereco: 'Test Address',
        area_interesse: 'Test Interest',
        activity_id: activityId,
        message: 'I want to help'
      });
      console.log('Volunteer submitted successfully:', volResult);
    }
  } catch (err) {
    console.error('❌ Volunteer submission error:', err);
  }

  console.log('\n--- TESTING SUPPORT REQUEST SUBMISSION ---');
  try {
    const msgResult = await submitMessage({
      name: 'Test Beneficiary',
      email: 'testbeneficiary@example.com',
      phone: '987654321',
      genero: 'Feminino',
      data_nascimento: '2015-05-15',
      endereco: 'Test Beneficiary Address',
      tipo_necessidade: 'Apoio Alimentar',
      subject: 'Pedido de Apoio',
      message: 'Need help with food and education'
    });
    console.log('Message submitted successfully:', msgResult);
  } catch (err) {
    console.error('❌ Support request submission error:', err);
  }
}

testSubmissions();
