import dotenv from 'dotenv';
import { supabaseAdmin } from './infra/supabaseAdmin.js';

dotenv.config();

async function testInsert() {
  const baseMessage = {
    name: 'Test Casing',
    email: 'test@example.com',
    phone: '987654321',
    genero: 'Feminino',
    data_nascimento: '2015-05-15',
    endereco: 'Test Address',
    tipo_necessidade: 'Apoio Alimentar',
    subject: 'Teste',
    message: 'Mensagem de teste'
  };

  const statusesToTest = [
    { label: 'Default status (no status key)', status: undefined },
    { label: 'Pendente', status: 'Pendente' },
    { label: 'Em Analise', status: 'Em Analise' },
    { label: 'Aceito', status: 'Aceito' },
    { label: 'Aprovado', status: 'Aprovado' },
    { label: 'Em Análise (with accent)', status: 'Em Análise' },
    { label: 'Aceito (with accent/different)', status: 'Aceito' }
  ];

  for (const item of statusesToTest) {
    console.log(`\nTesting status: "${item.label}" (value: ${item.status})...`);
    const row = { ...baseMessage };
    if (item.status !== undefined) {
      row.status = item.status;
    }
    
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([row])
      .select();
      
    if (error) {
      console.log(`❌ Failed with error: ${error.message} (Code: ${error.code})`);
    } else {
      console.log(`✅ Success! Inserted ID: ${data[0].id}, inserted status in DB: ${data[0].status}`);
      // Clean up the test row
      await supabaseAdmin.from('messages').delete().eq('id', data[0].id);
    }
  }
}

testInsert();
