import dotenv from 'dotenv';
dotenv.config();

import { getVolunteers, updateVolunteerStatus } from './modules/voluntarios/voluntarios.service.js';

async function testUpdate() {
  try {
    console.log('🔄 Buscando voluntários da BD...');
    const result = await getVolunteers();
    const volunteersList = result.data;
    console.log(`✅ Voluntários encontrados: ${volunteersList.length}`);

    if (volunteersList.length === 0) {
      console.log('⚠️ Nenhum voluntário encontrado na base de dados para testar.');
      return;
    }

    const firstVol = volunteersList[0];
    console.log(`ℹ️ Voluntário selecionado: ${firstVol.full_name} (ID: ${firstVol.id}, Estado Atual: ${firstVol.status})`);

    const newStatus = firstVol.status === 'Aprovado' ? 'Em Analise' : 'Aprovado';
    console.log(`🔄 Atualizando estado para: ${newStatus}...`);

    const updated = await updateVolunteerStatus(firstVol.id, newStatus);
    console.log(`✅ Atualizado com sucesso! Novo estado retornado: ${updated.status}`);

    // Reverter o estado para o original
    console.log(`🔄 Revertendo estado para: ${firstVol.status}...`);
    await updateVolunteerStatus(firstVol.id, firstVol.status);
    console.log('✅ Revertido com sucesso!');
  } catch (error) {
    console.error('❌ Erro no teste de atualização de voluntário:', error);
  }
}

testUpdate();
