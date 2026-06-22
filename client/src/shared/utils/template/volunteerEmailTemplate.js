import { getEmailLayout } from './emailLayout.js';

/**
 * Gera o template de e-mail em HTML para confirmação de candidatura a voluntário.
 * 
 * @param {object} data - Dados do voluntário
 * @param {string} data.full_name - Nome completo
 * @param {string} data.email - E-mail
 * @param {string} data.phone - Telefone
 * @param {string} data.genero - Género
 * @param {string} data.endereco - Endereço completo
 * @param {string} data.area_interesse - Área de interesse
 * @param {string} data.activityName - Nome da atividade de interesse selecionada
 * @param {string} data.message - Motivação / mensagem opcional
 * @returns {string} HTML completo do e-mail
 */
export function getVolunteerEmailHtml(data) {
  const contentHtml = `
    <h2 style="color: #1B314C; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Obrigado por se candidatar a Voluntário!</h2>
    <p style="margin-bottom: 24px;">Olá <strong>${data.full_name}</strong>,</p>
    <p style="margin-bottom: 24px;">Estamos muito entusiasmados com a sua vontade de fazer a diferença e colaborar com a ALEM! A sua candidatura a voluntário foi recebida com sucesso e já se encontra no nosso sistema.</p>
    
    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 24px; margin-bottom: 28px;">
      <h3 style="color: #3C5E82; font-size: 14px; font-weight: 700; text-transform: uppercase; margin-top: 0; margin-bottom: 16px; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">Dados da Candidatura</h3>
      
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748B; width: 140px; font-weight: 600; vertical-align: top;">Atividade de Interesse:</td>
          <td style="padding: 6px 0; color: #1E293B; font-weight: bold;">${data.activityName || 'Não especificada'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Área de Interesse:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.area_interesse || 'Não especificada'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Contacto:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.phone || 'Não fornecido'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748B; font-weight: 600; vertical-align: top;">Endereço:</td>
          <td style="padding: 6px 0; color: #1E293B;">${data.endereco || 'Não fornecido'}</td>
        </tr>
        ${data.message ? `
        <tr>
          <td colspan="2" style="padding-top: 16px; border-top: 1px solid #E2E8F0; color: #64748B; font-weight: 600; padding-bottom: 6px;">Porquê quer ser voluntário?</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 8px 12px; background-color: #ffffff; border: 1px solid #E2E8F0; border-radius: 6px; color: #334155; line-height: 1.5; font-style: italic;">
            ${data.message.replace(/\n/g, '<br>')}
          </td>
        </tr>
        ` : ''}
      </table>
    </div>

    <p style="margin-bottom: 24px;">O que acontece a seguir?<br>
    A nossa equipa de coordenação de voluntariado irá analisar o seu perfil e as vagas disponíveis para a atividade selecionada. Entraremos em contacto consigo para agendar uma breve conversa de integração nos próximos dias.</p>
    
    <div style="text-align: center; margin-top: 32px; margin-bottom: 32px;">
      <a href="https://alem.mz" target="_blank" style="background-color: #5E82AC; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: bold; border-radius: 6px; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(94, 130, 172, 0.3);">Visitar o nosso Website</a>
    </div>

    <p style="margin-top: 24px; border-top: 1px solid #E2E8F0; padding-top: 16px; color: #64748B; font-size: 14px;">
      Com muita gratidão,<br>
      <strong>Coordenação de Voluntariado ALEM</strong>
    </p>
  `;

  return getEmailLayout(contentHtml, `Candidatura a Voluntário Recebida - ALEM`);
}
