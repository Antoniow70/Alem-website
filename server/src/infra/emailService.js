import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

let transporter = null;

/**
 * Obtém ou inicializa o transportador SMTP do Nodemailer.
 * Retorna null se as credenciais do e-mail não estiverem configuradas.
 */
function getTransporter() {
  if (transporter) return transporter;

  const user = config.emailUser;
  const pass = config.emailPass;

  if (!user || !pass) {
    console.warn('⚠️ [EmailService] EMAIL_USER ou EMAIL_PASS não estão configurados no ficheiro .env. Os e-mails de confirmação serão simulados.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true para porto 465, false para outros portos
    auth: {
      user,
      pass
    }
  });

  return transporter;
}

/**
 * Envia um e-mail de forma assíncrona.
 * Se as credenciais estiverem em falta, simula o envio imprimindo logs no console.
 * 
 * @param {object} options
 * @param {string} options.to - E-mail do destinatário
 * @param {string} options.subject - Assunto do e-mail
 * @param {string} options.html - Conteúdo HTML do e-mail
 * @returns {Promise<object>} Detalhes do envio
 */
export async function sendEmail({ to, subject, html }) {
  const mailTransporter = getTransporter();

  if (!mailTransporter) {
    console.log('────────────────────────────────────────────────────────────');
    console.log(`✉️ [EmailService (SIMULAÇÃO)]`);
    console.log(`Destinatário: ${to}`);
    console.log(`Assunto:      ${subject}`);
    console.log('────────────────────────────────────────────────────────────');
    return { success: true, mocked: true };
  }

  try {
    const info = await mailTransporter.sendMail({
      from: `"ALEM" <${config.emailUser}>`,
      to,
      subject,
      html
    });
    console.log(`✅ [EmailService] E-mail enviado com sucesso para ${to}. ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [EmailService] Erro ao enviar e-mail para ${to}:`, error);
    throw error;
  }
}
