import PDFDocument from 'pdfkit';
import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

/**
 * Generates a consolidated landscape PDF report of donations, volunteers, and messages.
 * @param {string} startDate - Starting date (YYYY-MM-DD)
 * @param {string} endDate - Ending date (YYYY-MM-DD)
 * @returns {Promise<Buffer>} Buffer containing the PDF document
 */
export async function generateReportPDF(startDate, endDate, type = 'consolidated') {
  const dateFrom = `${startDate}T00:00:00`;
  const dateTo = `${endDate}T23:59:59`;

  let donations = [];
  let volunteers = [];
  let messages = [];

  const promises = [];

  if (type === 'consolidated' || type === 'donations') {
    promises.push(
      supabaseAdmin.from('donations').select('*').gte('created_at', dateFrom).lte('created_at', dateTo).order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error;
          donations = data || [];
        })
    );
  }

  if (type === 'consolidated' || type === 'volunteers') {
    promises.push(
      supabaseAdmin.from('volunteers').select('*, activities(name)').gte('created_at', dateFrom).lte('created_at', dateTo).order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error;
          volunteers = data || [];
        })
    );
  }

  if (type === 'consolidated' || type === 'support') {
    promises.push(
      supabaseAdmin.from('messages').select('*').gte('created_at', dateFrom).lte('created_at', dateTo).order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (error) throw error;
          messages = data || [];
        })
    );
  }

  await Promise.all(promises);

  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 36,
    bufferPages: true
  });

  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));

    const slate900 = '#0F172A';
    const slate700 = '#334155';
    const slate500 = '#64748B';
    const slate200 = '#E2E8F0';
    
    // Header Helper
    const drawHeader = (title) => {
      let reportName = 'Relatório Consolidado ALEM';
      if (type === 'volunteers') {
        reportName = 'Relatório de Voluntários ALEM';
      } else if (type === 'support') {
        reportName = 'Relatório de Pedidos de Apoio ALEM';
      } else if (type === 'donations') {
        reportName = 'Relatório de Doadores/Doações ALEM';
      }
      doc.fillColor(slate900).font('Helvetica-Bold').fontSize(18).text(reportName, 36, 36);
      doc.fillColor(slate500).font('Helvetica').fontSize(9).text('Associação de Luta e Esperança de Moçambique', 36, 56);
      
      doc.fillColor(slate700).font('Helvetica-Bold').fontSize(11).text(title, 36, 75);
      
      const formattedFrom = new Date(startDate + 'T00:00:00').toLocaleDateString('pt-PT');
      const formattedTo = new Date(endDate + 'T00:00:00').toLocaleDateString('pt-PT');
      doc.fillColor(slate500).font('Helvetica').fontSize(8.5).text(`Período: ${formattedFrom} a ${formattedTo}  |  Exportado em: ${new Date().toLocaleString('pt-PT')}`, 36, 92);
      
      doc.strokeColor(slate200).lineWidth(0.5).moveTo(36, 105).lineTo(doc.page.width - 36, 105).stroke();
    };

    // Draw footer helper
    const drawFooter = () => {
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fillColor(slate500).font('Helvetica').fontSize(7.5);
        doc.text('ALEM — Associação de Luta e Esperança de Moçambique  |  Documento Interno Administrativo', 36, doc.page.height - 30);
        doc.text(`Página ${i + 1} de ${pageCount}`, doc.page.width - 100, doc.page.height - 30, { width: 64, align: 'right' });
      }
    };

    let isFirstPage = true;

    // --- PAGE 1: RESUMO GERAL ---
    if (type === 'consolidated') {
      drawHeader('Resumo Geral da Organização');
      
      const totalDonAmount = donations.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
      const approvedVolunteers = volunteers.filter(v => v.status === 'Aprovado').length;
      const acceptedRequests = messages.filter(m => m.status === 'Aceito' || m.status === 'Aceitado' || m.status === 'Aprovado').length;

      doc.font('Helvetica-Bold').fontSize(10).fillColor(slate900).text('SUMÁRIO EXECUTIVO', 36, 125);

      const cardY = 145;
      const cardHeight = 65;
      const cardWidth = 230;
      const gap = 15;

      // Card 1: Doações
      doc.strokeColor(slate200).lineWidth(1).rect(36, cardY, cardWidth, cardHeight).stroke();
      doc.fillColor(slate500).font('Helvetica').fontSize(8).text('VALOR TOTAL ANGARIADO', 46, cardY + 12);
      doc.fillColor(slate900).font('Helvetica-Bold').fontSize(14).text(`MT ${totalDonAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`, 46, cardY + 27);
      doc.fillColor(slate500).font('Helvetica').fontSize(8).text(`${donations.length} doações declaradas`, 46, cardY + 47);

      // Card 2: Voluntários
      doc.strokeColor(slate200).lineWidth(1).rect(36 + cardWidth + gap, cardY, cardWidth, cardHeight).stroke();
      doc.fillColor(slate500).font('Helvetica').fontSize(8).text('CANDIDATURAS DE VOLUNTARIADO', 36 + cardWidth + gap + 10, cardY + 12);
      doc.fillColor(slate900).font('Helvetica-Bold').fontSize(14).text(String(volunteers.length), 36 + cardWidth + gap + 10, cardY + 27);
      doc.fillColor(slate500).font('Helvetica').fontSize(8).text(`${approvedVolunteers} candidaturas aprovadas`, 36 + cardWidth + gap + 10, cardY + 47);

      // Card 3: Apoios
      doc.strokeColor(slate200).lineWidth(1).rect(36 + (cardWidth + gap) * 2, cardY, cardWidth, cardHeight).stroke();
      doc.fillColor(slate500).font('Helvetica').fontSize(8).text('PEDIDOS DE APOIO RECEBIDOS', 36 + (cardWidth + gap) * 2 + 10, cardY + 12);
      doc.fillColor(slate900).font('Helvetica-Bold').fontSize(14).text(String(messages.length), 36 + (cardWidth + gap) * 2 + 10, cardY + 27);
      doc.fillColor(slate500).font('Helvetica').fontSize(8).text(`${acceptedRequests} pedidos aceites`, 36 + (cardWidth + gap) * 2 + 10, cardY + 47);

      doc.fillColor(slate900).font('Helvetica-Bold').fontSize(10).text('NOTAS E DIRETRIZES DO RELATÓRIO', 36, 235);
      doc.fillColor(slate700).font('Helvetica').fontSize(8.5).text(
        '1. Este documento reúne todas as atividades declaradas no sistema de apoio ALEM durante o período indicado.\n' +
        '2. Os dados de doações referem-se a intenções submetidas por doadores no site institucional. A validação do recebimento financeiro é offline e efetuada manualmente pelos administradores.\n' +
        '3. Os pedidos de apoio e voluntariado recusados foram eliminados definitivamente do banco de dados para proteção de privacidade de dados, em conformidade com as regras de integridade do sistema ALEM.\n' +
        '4. Qualquer inconsistência nos dados deve ser reportada ao responsável técnico de base de dados da ALEM.',
        36, 255, { lineGap: 5 }
      );
      
      isFirstPage = false;
    }

    // --- PAGE 2: DOAÇÕES ---
    if (type === 'consolidated' || type === 'donations') {
      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;
      drawHeader('Listagem de Doações');

      let currentY = 120;
      
      if (type === 'donations') {
        const totalDonAmount = donations.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
        doc.strokeColor(slate200).lineWidth(1).rect(36, 115, 230, 45).stroke();
        doc.fillColor(slate500).font('Helvetica').fontSize(7.5).text('VALOR TOTAL ANGARIADO NO PERÍODO', 46, 123);
        doc.fillColor(slate900).font('Helvetica-Bold').fontSize(11).text(`MT ${totalDonAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`, 46, 135);
        doc.fillColor(slate500).font('Helvetica').fontSize(7.5).text(`${donations.length} doações declaradas`, 175, 137);
        currentY = 175;
      }

      doc.font('Helvetica-Bold').fontSize(8).fillColor(slate900);
      doc.text('#', 36, currentY, { width: 20 });
      doc.text('Doador', 60, currentY, { width: 150 });
      doc.text('Contacto', 220, currentY, { width: 140 });
      doc.text('Causa / Projeto', 370, currentY, { width: 130 });
      doc.text('Método', 510, currentY, { width: 80 });
      doc.text('Data & Hora', 600, currentY, { width: 100 });
      doc.text('Valor', 710, currentY, { width: 100, align: 'right' });

      doc.strokeColor(slate700).lineWidth(0.5).moveTo(36, currentY + 12).lineTo(doc.page.width - 36, currentY + 12).stroke();
      currentY += 18;

      doc.font('Helvetica').fontSize(7.5).fillColor(slate700);
      if (donations.length === 0) {
        doc.text('Nenhuma doação registada neste período.', 36, currentY);
      } else {
        donations.forEach((d, index) => {
          if (currentY > doc.page.height - 50) {
            doc.addPage();
            drawHeader('Listagem de Doações (Continuação)');
            currentY = 120;
            doc.font('Helvetica-Bold').fontSize(8).fillColor(slate900);
            doc.text('#', 36, currentY);
            doc.text('Doador', 60, currentY);
            doc.text('Contacto', 220, currentY);
            doc.text('Causa / Projeto', 370, currentY);
            doc.text('Método', 510, currentY);
            doc.text('Data & Hora', 600, currentY);
            doc.text('Valor', 710, currentY, { align: 'right' });
            doc.strokeColor(slate700).lineWidth(0.5).moveTo(36, currentY + 12).lineTo(doc.page.width - 36, currentY + 12).stroke();
            currentY += 18;
            doc.font('Helvetica').fontSize(7.5).fillColor(slate700);
          }

          const dateStr = d.created_at ? new Date(d.created_at).toLocaleString('pt-PT') : '—';
          doc.text(String(donations.length - index), 36, currentY);
          doc.text(d.nome || 'Doador Anónimo', 60, currentY, { width: 150 });
          doc.text(`${d.telefone || ''}\n${d.email || ''}`, 220, currentY, { width: 140 });
          doc.text(d.causa || 'Geral', 370, currentY, { width: 130 });
          doc.text(d.metodo_pagamento || '—', 510, currentY, { width: 80 });
          doc.text(dateStr, 600, currentY, { width: 100 });
          
          const valorNum = parseFloat(d.valor || 0);
          doc.text(`MT ${valorNum.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`, 710, currentY, { width: 100, align: 'right' });

          doc.strokeColor(slate200).lineWidth(0.2).moveTo(36, currentY + 18).lineTo(doc.page.width - 36, currentY + 18).stroke();
          currentY += 22;
        });
      }
    }

    // --- PAGE 3: VOLUNTÁRIOS ---
    if (type === 'consolidated' || type === 'volunteers') {
      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;
      drawHeader('Listagem de Candidaturas a Voluntariado');
      let currentY = 120;

      if (type === 'volunteers') {
        const approvedVolunteers = volunteers.filter(v => v.status === 'Aprovado').length;
        doc.strokeColor(slate200).lineWidth(1).rect(36, 115, 230, 45).stroke();
        doc.fillColor(slate500).font('Helvetica').fontSize(7.5).text('TOTAL CANDIDATURAS NO PERÍODO', 46, 123);
        doc.fillColor(slate900).font('Helvetica-Bold').fontSize(11).text(String(volunteers.length), 46, 135);
        doc.fillColor(slate500).font('Helvetica').fontSize(7.5).text(`${approvedVolunteers} aprovadas`, 175, 137);
        currentY = 175;
      }

      doc.font('Helvetica-Bold').fontSize(8).fillColor(slate900);
      doc.text('#', 36, currentY, { width: 20 });
      doc.text('Nome Completo', 60, currentY, { width: 150 });
      doc.text('Contacto', 220, currentY, { width: 140 });
      doc.text('Endereço', 370, currentY, { width: 110 });
      doc.text('Área de Interesse / Atividade', 490, currentY, { width: 170 });
      doc.text('Data Submissão', 670, currentY, { width: 80 });
      doc.text('Estado', 760, currentY, { width: 50, align: 'right' });

      doc.strokeColor(slate700).lineWidth(0.5).moveTo(36, currentY + 12).lineTo(doc.page.width - 36, currentY + 12).stroke();
      currentY += 18;

      doc.font('Helvetica').fontSize(7.5).fillColor(slate700);
      if (volunteers.length === 0) {
        doc.text('Nenhuma candidatura de voluntariado registada neste período.', 36, currentY);
      } else {
        volunteers.forEach((v, index) => {
          if (currentY > doc.page.height - 50) {
            doc.addPage();
            drawHeader('Listagem de Voluntários (Continuação)');
            currentY = 120;
            doc.font('Helvetica-Bold').fontSize(8).fillColor(slate900);
            doc.text('#', 36, currentY);
            doc.text('Nome Completo', 60, currentY);
            doc.text('Contacto', 220, currentY);
            doc.text('Endereço', 370, currentY);
            doc.text('Área de Interesse / Atividade', 490, currentY);
            doc.text('Data Submissão', 670, currentY);
            doc.text('Estado', 760, currentY, { align: 'right' });
            doc.strokeColor(slate700).lineWidth(0.5).moveTo(36, currentY + 12).lineTo(doc.page.width - 36, currentY + 12).stroke();
            currentY += 18;
            doc.font('Helvetica').fontSize(7.5).fillColor(slate700);
          }

          const dateStr = v.created_at ? new Date(v.created_at).toLocaleDateString('pt-PT') : '—';
          const actName = v.activities?.name ? `(${v.activities.name})` : '';
          const interesseStr = `${v.area_interesse || '—'} ${actName}`;
          
          doc.text(String(volunteers.length - index), 36, currentY);
          doc.text(v.full_name || '—', 60, currentY, { width: 150 });
          doc.text(`${v.phone || ''}\n${v.email || ''}`, 220, currentY, { width: 140 });
          doc.text(v.endereco || '—', 370, currentY, { width: 110 });
          doc.text(interesseStr, 490, currentY, { width: 170 });
          doc.text(dateStr, 670, currentY, { width: 80 });
          doc.text(v.status || 'Pendente', 760, currentY, { width: 50, align: 'right' });

          doc.strokeColor(slate200).lineWidth(0.2).moveTo(36, currentY + 18).lineTo(doc.page.width - 36, currentY + 18).stroke();
          currentY += 22;
        });
      }
    }

    // --- PAGE 4: PEDIDOS DE APOIO ---
    if (type === 'consolidated' || type === 'support') {
      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;
      drawHeader('Listagem de Pedidos de Apoio (Beneficiários)');
      let currentY = 120;

      if (type === 'support') {
        const acceptedRequests = messages.filter(m => m.status === 'Aceito' || m.status === 'Aceitado' || m.status === 'Aprovado').length;
        doc.strokeColor(slate200).lineWidth(1).rect(36, 115, 230, 45).stroke();
        doc.fillColor(slate500).font('Helvetica').fontSize(7.5).text('PEDIDOS DE APOIO NO PERÍODO', 46, 123);
        doc.fillColor(slate900).font('Helvetica-Bold').fontSize(11).text(String(messages.length), 46, 135);
        doc.fillColor(slate500).font('Helvetica').fontSize(7.5).text(`${acceptedRequests} pedidos aceites`, 175, 137);
        currentY = 175;
      }

      doc.font('Helvetica-Bold').fontSize(8).fillColor(slate900);
      doc.text('#', 36, currentY, { width: 20 });
      doc.text('Nome Beneficiário', 60, currentY, { width: 140 });
      doc.text('Contacto', 210, currentY, { width: 130 });
      doc.text('Necessidade / Assunto', 350, currentY, { width: 180 });
      doc.text('Mensagem', 540, currentY, { width: 170 });
      doc.text('Data', 720, currentY, { width: 50 });
      doc.text('Estado', 780, currentY, { width: 30, align: 'right' });

      doc.strokeColor(slate700).lineWidth(0.5).moveTo(36, currentY + 12).lineTo(doc.page.width - 36, currentY + 12).stroke();
      currentY += 18;

      doc.font('Helvetica').fontSize(7.5).fillColor(slate700);
      if (messages.length === 0) {
        doc.text('Nenhum pedido de apoio registado neste período.', 36, currentY);
      } else {
        messages.forEach((m, index) => {
          if (currentY > doc.page.height - 60) {
            doc.addPage();
            drawHeader('Listagem de Pedidos de Apoio (Continuação)');
            currentY = 120;
            doc.font('Helvetica-Bold').fontSize(8).fillColor(slate900);
            doc.text('#', 36, currentY);
            doc.text('Nome Beneficiário', 60, currentY);
            doc.text('Contacto', 210, currentY);
            doc.text('Necessidade / Assunto', 350, currentY);
            doc.text('Mensagem', 540, currentY);
            doc.text('Data', 720, currentY);
            doc.text('Estado', 780, currentY, { align: 'right' });
            doc.strokeColor(slate700).lineWidth(0.5).moveTo(36, currentY + 12).lineTo(doc.page.width - 36, currentY + 12).stroke();
            currentY += 18;
            doc.font('Helvetica').fontSize(7.5).fillColor(slate700);
          }

          const dateStr = m.created_at ? new Date(m.created_at).toLocaleDateString('pt-PT') : '—';
          const necStr = `[${m.tipo_necessidade || 'Geral'}] ${m.subject || ''}`;
          
          doc.text(String(messages.length - index), 36, currentY);
          doc.text(m.name || '—', 60, currentY, { width: 140 });
          doc.text(`${m.phone || ''}\n${m.email || ''}`, 210, currentY, { width: 130 });
          doc.text(necStr, 350, currentY, { width: 180 });
          doc.text(m.message || '—', 540, currentY, { width: 170 });
          doc.text(dateStr, 720, currentY, { width: 50 });
          doc.text(m.status || 'Pendente', 780, currentY, { width: 30, align: 'right' });

          doc.strokeColor(slate200).lineWidth(0.2).moveTo(36, currentY + 18).lineTo(doc.page.width - 36, currentY + 18).stroke();
          currentY += 22;
        });
      }
    }

    drawFooter();
    doc.end();
  });
}
