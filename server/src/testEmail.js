import { sendEmail } from './infra/emailService.js';
import { config } from './config/env.js';

async function testEmail() {
  console.log('--- TESTANDO SERVIÇO DE ENVIO DE E-MAILS ---');
  console.log(`Usando e-mail: ${config.emailUser}`);
  console.log(`Senha configurada: ${config.emailPass ? '✅ Sim (oculta)' : '❌ Não'}`);

  try {
    const result = await sendEmail({
      to: config.emailUser,
      subject: 'Teste de Envio de E-mail - ALEM',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4f46e5;">Teste do Nodemailer com Gmail</h2>
          <p>Olá,</p>
          <p>Este é um e-mail de teste enviado automaticamente para verificar se a integração com o Nodemailer e o Gmail SMTP está funcionando corretamente.</p>
          <p>Se você recebeu este e-mail, as credenciais e a configuração estão 100% corretas!</p>
          <br>
          <p>Atenciosamente,<br>Equipa ALEM</p>
        </div>
      `
    });

    console.log('Resultado do Envio:', result);
    if (result.success && !result.mocked) {
      console.log('✅ O e-mail foi enviado com sucesso através do transporte SMTP real!');
    } else if (result.mocked) {
      console.log('⚠️ O envio de e-mail foi simulado (credenciais em falta).');
    }
  } catch (error) {
    console.error('❌ Falha ao enviar e-mail de teste:', error);
  }
}

testEmail();
