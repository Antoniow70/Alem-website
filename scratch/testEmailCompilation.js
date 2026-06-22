import { sendEmail } from '../server/src/infra/emailService.js';
import { getSupportEmailHtml } from '../client/src/shared/utils/template/supportEmailTemplate.js';
import { getVolunteerEmailHtml } from '../client/src/shared/utils/template/volunteerEmailTemplate.js';

// Configurar variáveis de ambiente temporárias para teste de simulação se não existirem
process.env.EMAIL_USER = process.env.EMAIL_USER || '';
process.env.EMAIL_PASS = process.env.EMAIL_PASS || '';

async function runTest() {
  console.log('🧪 Iniciando teste de compilação e simulação de e-mails...\n');

  // 1. Dados de Teste para Suporte
  const supportData = {
    name: 'João Silva',
    email: 'joao.silva@example.com',
    phone: '912345678',
    genero: 'Masculino',
    data_nascimento: '1995-05-15',
    endereco: 'Rua das Flores 123',
    tipo_necessidade: 'Apoio Alimentar',
    message: 'Gostaria de solicitar apoio alimentar para a minha família de 4 pessoas.'
  };

  // 2. Dados de Teste para Voluntariado
  const volunteerData = {
    full_name: 'Maria Santos',
    email: 'maria.santos@example.com',
    phone: '987654321',
    genero: 'Feminino',
    endereco: 'Avenida Central 456',
    area_interesse: 'Educação',
    activityName: 'Apoio Escolar e Tutoria',
    message: 'Tenho muita vontade de ajudar a ensinar crianças.'
  };

  try {
    console.log('🔄 Gerando HTML do Pedido de Apoio...');
    const supportHtml = getSupportEmailHtml(supportData);
    console.log('✅ HTML do Pedido de Apoio gerado com sucesso!');

    console.log('🔄 Enviando E-mail de Apoio (Simulado/Real)...');
    await sendEmail({
      to: supportData.email,
      subject: 'Recebemos o seu pedido de apoio - ALEM',
      html: supportHtml
    });

    console.log('\n🔄 Gerando HTML da Candidatura a Voluntário...');
    const volunteerHtml = getVolunteerEmailHtml(volunteerData);
    console.log('✅ HTML da Candidatura a Voluntário gerado com sucesso!');

    console.log('🔄 Enviando E-mail de Voluntário (Simulado/Real)...');
    await sendEmail({
      to: volunteerData.email,
      subject: 'Candidatura a Voluntário Recebida - ALEM',
      html: volunteerHtml
    });

    console.log('\n🎉 Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    process.exit(1);
  }
}

runTest();
