import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * ============================================================
 * ALEM — Sistema Coeso de Exportacao de PDF Minimalista
 * ============================================================
 */

// ── Cores da Paleta Minimalista (Slate Neutrals) ────────────
const COLORS = {
  slate900:  [15, 23, 42],      // #0F172A
  slate800:  [30, 41, 59],      // #1E293B
  slate700:  [51, 65, 85],      // #334155
  slate500:  [100, 116, 139],    // #64748B
  
  slate200:  [226, 232, 240],    // #E2E8F0
  slate100:  [241, 245, 249],    // #F1F5F9
  slate50:   [248, 250, 252],    // #F8FAFC
  white:     [255, 255, 255],

  amber:     [180, 83, 9],      // Pendente (#B45309)
  sky:       [3, 105, 161],     // Em Analise (#0369A1)
  emerald:   [4, 120, 87],      // Aceito / Aprovado (#047857)
  rose:      [190, 18, 60],     // Recusado (#BE123C)
};

const STATUS_TEXT_COLORS = {
  'Pendente':   COLORS.amber,
  'Em Analise': COLORS.sky,
  'Aceito':     COLORS.emerald,
  'Aprovado':   COLORS.emerald,
  'Aceitado':   COLORS.emerald,
  'Recusado':   COLORS.rose,
};

// ── Helpers de Formatacao Compartilhados ────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return `${d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
}

/**
 * Exporta dados de doadores e causas.
 */
export function exportDonationsPDF(filteredDonations, { filterStart = '', filterEnd = '' } = {}) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Cabecalho
  doc.setTextColor(...COLORS.slate900);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatorio de Doacoes e Contribuicoes', 14, 20);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.slate500);
  doc.text('ALEM — Associacao de Luta e Esperanca de Mocambique', 14, 25.5);

  doc.setDrawColor(...COLORS.slate200);
  doc.setLineWidth(0.3);
  doc.line(14, 29.5, pageWidth - 14, 29.5);

  // 2. Metadados dos Filtros
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.slate500);

  const filterParts = [];
  if (filterStart || filterEnd) {
    const from = filterStart ? formatDate(filterStart + 'T00:00:00') : 'Inicio';
    const to = filterEnd ? formatDate(filterEnd + 'T00:00:00') : 'Hoje';
    filterParts.push(`Periodo: ${from} a ${to}`);
  }
  const filtersText = filterParts.length > 0 ? filterParts.join('  |  ') : 'Sem filtros aplicados (todos os registos)';
  
  doc.text(`Filtros: ${filtersText}`, 14, 36);

  const generatedText = `Exportado em: ${new Date().toLocaleString('pt-PT')}`;
  doc.text(generatedText, pageWidth - 14, 36, { align: 'right' });

  doc.setDrawColor(...COLORS.slate100);
  doc.setLineWidth(0.15);
  doc.line(14, 40, pageWidth - 14, 40);

  // 3. Resumo Estatistico (2 Paineis)
  const totalAmount = filteredDonations.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
  const cardWidth = (pageWidth - 28 - 6) / 2;
  const cardHeight = 15;
  const yStats = 44;

  const stats = [
    { label: 'NUMERO TOTAL DE DOACOES', value: String(filteredDonations.length) },
    { label: 'VALOR TOTAL ANGARIADO', value: `MT ${totalAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}` },
  ];

  stats.forEach((card, i) => {
    const x = 14 + i * (cardWidth + 6);
    doc.setDrawColor(...COLORS.slate200);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, yStats, cardWidth, cardHeight, 1.2, 1.2, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.slate500);
    doc.text(card.label, x + 5, yStats + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.slate800);
    doc.text(card.value, x + 5, yStats + 11.5);
  });

  // 4. Tabela de Registos
  const columns = [
    { header: '#',               dataKey: 'idx' },
    { header: 'Doador',          dataKey: 'nome' },
    { header: 'Contacto',        dataKey: 'contacto' },
    { header: 'Causa / Projeto', dataKey: 'causa' },
    { header: 'Valor',           dataKey: 'valor' },
    { header: 'Metodo',          dataKey: 'metodo' },
    { header: 'Data & Hora',     dataKey: 'data' },
    { header: 'Mensagem',        dataKey: 'mensagem' },
  ];

  const rows = filteredDonations.map((d, idx) => ({
    idx:      String(filteredDonations.length - idx),
    nome:     d.nome || 'Doador Anonimo',
    contacto: [d.telefone, d.email].filter(Boolean).join('\n') || '—',
    causa:    d.causa || 'Geral / Onde necessario',
    valor:    `MT ${parseFloat(d.valor || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`,
    metodo:   d.metodo_pagamento || '—',
    data:     formatDateTime(d.created_at),
    mensagem: d.mensagem || '—',
  }));

  autoTable(doc, {
    columns,
    body: rows,
    startY: yStats + cardHeight + 7,
    theme: 'row',
    styles: {
      fontSize: 7,
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
      overflow: 'linebreak',
      lineColor: COLORS.slate200,
      lineWidth: 0.1,
      textColor: COLORS.slate700,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: COLORS.slate50,
      textColor: COLORS.slate900,
      fontStyle: 'bold',
      fontSize: 7.2,
      halign: 'left',
      cellPadding: { top: 4.5, right: 3, bottom: 4.5, left: 3 },
    },
    columnStyles: {
      idx:      { halign: 'center', cellWidth: 8, fontStyle: 'bold' },
      nome:     { cellWidth: 35, fontStyle: 'bold', textColor: COLORS.slate900 },
      contacto: { cellWidth: 35 },
      causa:    { cellWidth: 35 },
      valor:    { halign: 'right', fontStyle: 'bold', cellWidth: 28, textColor: COLORS.slate900 },
      metodo:   { cellWidth: 24, halign: 'center' },
      data:     { cellWidth: 26, halign: 'center' },
      mensagem: { cellWidth: 60 },
    },
  });

  // 5. Rodape
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.slate200);
    doc.setLineWidth(0.1);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.slate500);
    doc.text(
      'ALEM — Associacao de Luta e Esperanca de Mocambique  |  Documento Financeiro Interno',
      14,
      pageHeight - 9
    );

    doc.text(
      `Pagina ${i} de ${pageCount}`,
      pageWidth - 14,
      pageHeight - 9,
      { align: 'right' }
    );
  }

  const suffix = (filterStart || filterEnd)
    ? `_${filterStart || 'inicio'}_a_${filterEnd || 'hoje'}`
    : '_todos';
  doc.save(`doacoes_${new Date().toISOString().split('T')[0]}${suffix}.pdf`);
}

/**
 * Exporta dados de candidaturas de voluntarios.
 */
export function exportVolunteersPDF(filteredVolunteers, { readFilter = 'Todos', search = '' } = {}) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Cabecalho
  doc.setTextColor(...COLORS.slate900);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatorio de Candidaturas a Voluntariado', 14, 20);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.slate500);
  doc.text('ALEM — Associacao de Luta e Esperanca de Mocambique', 14, 25.5);

  doc.setDrawColor(...COLORS.slate200);
  doc.setLineWidth(0.3);
  doc.line(14, 29.5, pageWidth - 14, 29.5);

  // 2. Metadados dos Filtros
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.slate500);

  const filterParts = [];
  if (readFilter && readFilter !== 'Todos') {
    filterParts.push(`Estado: ${readFilter}`);
  }
  if (search) {
    filterParts.push(`Busca: "${search}"`);
  }
  const filtersText = filterParts.length > 0 ? filterParts.join('  |  ') : 'Sem filtros aplicados (todos os registos)';
  
  doc.text(`Filtros: ${filtersText}`, 14, 36);

  const generatedText = `Exportado em: ${new Date().toLocaleString('pt-PT')}`;
  doc.text(generatedText, pageWidth - 14, 36, { align: 'right' });

  doc.setDrawColor(...COLORS.slate100);
  doc.setLineWidth(0.15);
  doc.line(14, 40, pageWidth - 14, 40);

  // 3. Resumo Estatistico (3 Paineis)
  const total = filteredVolunteers.length;
  const pending = filteredVolunteers.filter(v => v.status === 'Pendente').length;
  const approved = filteredVolunteers.filter(v => v.status === 'Aprovado' || v.status === 'Aceito').length;

  const cardWidth = (pageWidth - 28 - 12) / 3;
  const cardHeight = 15;
  const yStats = 44;

  const stats = [
    { label: 'CANDIDATURAS SUBMETIDAS', value: String(total) },
    { label: 'PENDENTES DE REVISAO', value: String(pending) },
    { label: 'VOLUNTARIOS APROVADOS', value: String(approved) },
  ];

  stats.forEach((card, i) => {
    const x = 14 + i * (cardWidth + 6);
    doc.setDrawColor(...COLORS.slate200);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, yStats, cardWidth, cardHeight, 1.2, 1.2, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.slate500);
    doc.text(card.label, x + 5, yStats + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.slate800);
    doc.text(card.value, x + 5, yStats + 11.5);
  });

  // 4. Tabela de Registos
  const columns = [
    { header: '#',                 dataKey: 'idx' },
    { header: 'Nome Completo',     dataKey: 'nome' },
    { header: 'Genero',            dataKey: 'genero' },
    { header: 'Contacto',          dataKey: 'contacto' },
    { header: 'Endereco',          dataKey: 'endereco' },
    { header: 'Area de Interesse',  dataKey: 'interesse' },
    { header: 'Data de Submissao', dataKey: 'data' },
    { header: 'Estado',            dataKey: 'status' },
  ];

  const rows = filteredVolunteers.map((vol, idx) => ({
    idx:       String(filteredVolunteers.length - idx),
    nome:      vol.full_name || '—',
    genero:    vol.genero || '—',
    contacto:  [vol.phone, vol.email].filter(Boolean).join('\n') || '—',
    endereco:  vol.endereco || '—',
    interesse: vol.area_interesse || '—',
    data:      vol.created_at ? formatDate(vol.created_at) : '—',
    status:    vol.status || '—',
  }));

  autoTable(doc, {
    columns,
    body: rows,
    startY: yStats + cardHeight + 7,
    theme: 'row',
    styles: {
      fontSize: 7,
      cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
      overflow: 'linebreak',
      lineColor: COLORS.slate200,
      lineWidth: 0.1,
      textColor: COLORS.slate700,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: COLORS.slate50,
      textColor: COLORS.slate900,
      fontStyle: 'bold',
      fontSize: 7.2,
      halign: 'left',
      cellPadding: { top: 4.5, right: 3, bottom: 4.5, left: 3 },
    },
    columnStyles: {
      idx:       { halign: 'center', cellWidth: 8, fontStyle: 'bold' },
      nome:      { cellWidth: 42, fontStyle: 'bold', textColor: COLORS.slate900 },
      genero:    { cellWidth: 15, halign: 'center' },
      contacto:  { cellWidth: 45 },
      endereco:  { cellWidth: 42 },
      interesse: { cellWidth: 42 },
      data:      { cellWidth: 26, halign: 'center' },
      status:    { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (hookData) => {
      if (hookData.section === 'body' && hookData.column.dataKey === 'status') {
        let rawStatus = hookData.cell.raw;

        if (rawStatus === 'Em Analise') {
          hookData.cell.text = ['Em Analise'];
        } else if (rawStatus === 'Aceitado' || rawStatus === 'Aprovado') {
          hookData.cell.text = ['Aprovado'];
          rawStatus = 'Aprovado';
        }

        const color = STATUS_TEXT_COLORS[rawStatus];
        if (color) {
          hookData.cell.styles.textColor = color;
        }
      }
    },
  });

  // 5. Rodape
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...COLORS.slate200);
    doc.setLineWidth(0.1);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.slate500);
    doc.text(
      'ALEM — Associacao de Luta e Esperanca de Mocambique  |  Documento de Recursos Humanos Interno',
      14,
      pageHeight - 9
    );

    doc.text(
      `Pagina ${i} de ${pageCount}`,
      pageWidth - 14,
      pageHeight - 9,
      { align: 'right' }
    );
  }

  doc.save(`voluntarios_${new Date().toISOString().split('T')[0]}.pdf`);
}

// Re-exporta o template de Pedidos de Apoio ja minimalista
export { exportSupportPDF } from './templates/supportPdfTemplate';
