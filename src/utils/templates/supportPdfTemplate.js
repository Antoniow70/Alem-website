import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * ============================================================
 * ALEM — Relatório de Pedidos de Apoio (Minimalist & Professional)
 * ============================================================
 */

// ── Cores da Paleta Minimalista (Slate Neutrals & Soft Accent) ──
const COLORS = {
  // Neutras Escuras
  slate900:  [15, 23, 42],      // #0F172A
  slate800:  [30, 41, 59],      // #1E293B
  slate700:  [51, 65, 85],      // #334155
  slate500:  [100, 116, 139],    // #64748B
  
  // Linhas e Divisórias
  slate200:  [226, 232, 240],    // #E2E8F0
  slate100:  [241, 245, 249],    // #F1F5F9
  slate50:   [248, 250, 252],    // #F8FAFC
  white:     [255, 255, 255],

  // Tons de Destaque para Status (Sem Fundo, Apenas Texto)
  amber:     [180, 83, 9],      // Pendente (#B45309)
  sky:       [3, 105, 161],     // Em Análise (#0369A1)
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

// ── Helpers de Formatação ──────────────────────────────────
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

function calcAge(dataNascimento) {
  if (!dataNascimento) return '—';
  const birth = new Date(dataNascimento);
  if (isNaN(birth.getTime())) return '—';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} anos`;
}

// ── Desenhar Cabeçalho ──────────────────────────────────────
function drawHeader(doc, pageWidth) {
  // Título do Relatório
  doc.setTextColor(...COLORS.slate900);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Pedidos de Apoio', 14, 20);

  // Nome da Organização / Subtítulo
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.slate500);
  doc.text('ALEM — Associação de Luta e Esperança de Moçambique', 14, 25.5);

  // Linha Separadora Principal
  doc.setDrawColor(...COLORS.slate200);
  doc.setLineWidth(0.3);
  doc.line(14, 29.5, pageWidth - 14, 29.5);

  return 31;
}

// ── Desenhar Metadados e Filtros ────────────────────────────
function drawMetaInfo(doc, y, { readFilter, search, filterStart, filterEnd }) {
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.slate500);

  const filterParts = [];
  if (readFilter && readFilter !== 'Todos') {
    filterParts.push(`Leitura: ${readFilter}`);
  }
  if (search) {
    filterParts.push(`Busca: "${search}"`);
  }
  if (filterStart || filterEnd) {
    const from = filterStart ? formatDate(filterStart + 'T00:00:00') : 'Início';
    const to = filterEnd ? formatDate(filterEnd + 'T00:00:00') : 'Hoje';
    filterParts.push(`Período: ${from} a ${to}`);
  }

  const filtersText = filterParts.length > 0 ? filterParts.join('  |  ') : 'Sem filtros aplicados (todos os registos)';
  
  // Filtros à esquerda
  doc.text(`Filtros: ${filtersText}`, 14, y + 5);

  // Data de exportação à direita
  const generatedText = `Exportado em: ${new Date().toLocaleString('pt-PT')}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.text(generatedText, pageWidth - 14, y + 5, { align: 'right' });

  // Linha divisória fina
  doc.setDrawColor(...COLORS.slate100);
  doc.setLineWidth(0.15);
  doc.line(14, y + 9, pageWidth - 14, y + 9);

  return y + 13;
}

// ── Desenhar Resumos / Estatísticas ──────────────────────────
function drawStatCards(doc, y, stats, pageWidth) {
  const cardWidth = (pageWidth - 28 - 18) / 4; // 4 blocos de resumo
  const cardHeight = 15;
  const gap = 6;
  const startX = 14;

  const cards = [
    { label: 'TOTAL DE PEDIDOS', value: String(stats.total) },
    { label: 'PENDENTES', value: String(stats.pendentes) },
    { label: 'EM ANÁLISE', value: String(stats.emAnalise) },
    { label: 'ACEITOS / APROVADOS', value: String(stats.aceitos) },
  ];

  cards.forEach((card, i) => {
    const x = startX + i * (cardWidth + gap);

    // Caixa de resumo minimalista (apenas contorno fino, sem preenchimento pesado)
    doc.setDrawColor(...COLORS.slate200);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, cardWidth, cardHeight, 1.2, 1.2, 'S');

    // Label em caixa alta, pequena e cinza
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.slate500);
    doc.text(card.label, x + 5, y + 5.5);

    // Valor destacado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.slate800);
    doc.text(card.value, x + 5, y + 11.5);
  });

  return y + cardHeight + 7;
}

// ── Desenhar Tabela de Pedidos ──────────────────────────────
function drawTable(doc, y, data) {
  const columns = [
    { header: '#',               dataKey: 'idx' },
    { header: 'Nome Completo',   dataKey: 'name' },
    { header: 'Género',          dataKey: 'genero' },
    { header: 'Idade',           dataKey: 'idade' },
    { header: 'Contacto',       dataKey: 'contacto' },
    { header: 'Endereço',       dataKey: 'endereco' },
    { header: 'Necessidade',    dataKey: 'necessidade' },
    { header: 'Assunto / Apoio', dataKey: 'subject' },
    { header: 'Data',            dataKey: 'data' },
    { header: 'Estado',          dataKey: 'status' },
  ];

  const rows = data.map((msg, i) => {
    const isUnread = msg.read_status === 'Nao Lido';
    const namePrefix = isUnread ? '• ' : '';
    return {
      idx:         String(data.length - i),
      name:        namePrefix + (msg.name || '—'),
      genero:      msg.genero || '—',
      idade:       calcAge(msg.data_nascimento),
      contacto:    [msg.phone, msg.email].filter(Boolean).join('\n') || '—',
      endereco:    msg.endereco || '—',
      necessidade: msg.tipo_necessidade || '—',
      subject:     msg.subject || '—',
      data:        formatDateTime(msg.created_at),
      status:      msg.status || '—',
      isUnread:    isUnread
    };
  });

  autoTable(doc, {
    columns,
    body: rows,
    startY: y,
    theme: 'row', // Apenas linhas horizontais para estilo editorial limpo
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
      fillColor: COLORS.slate50, // Fundo cinza ultra-claro para a cabeceira
      textColor: COLORS.slate900,
      fontStyle: 'bold',
      fontSize: 7.2,
      halign: 'left',
      cellPadding: { top: 4.5, right: 3, bottom: 4.5, left: 3 },
    },
    columnStyles: {
      idx:         { halign: 'center', cellWidth: 8, fontStyle: 'bold' },
      name:        { cellWidth: 32, fontStyle: 'bold', textColor: COLORS.slate900 },
      genero:      { cellWidth: 12, halign: 'center' },
      idade:       { cellWidth: 12, halign: 'center' },
      contacto:    { cellWidth: 32 },
      endereco:    { cellWidth: 28 },
      necessidade: { cellWidth: 24 },
      subject:     { cellWidth: 38 },
      data:        { cellWidth: 24, halign: 'center' },
      status:      { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (hookData) => {
      // Formatação condicional minimalista do status
      if (hookData.section === 'body' && hookData.column.dataKey === 'status') {
        let rawStatus = hookData.cell.raw;

        // Normalização das strings de status
        if (rawStatus === 'Em Analise') {
          hookData.cell.text = ['Em Análise'];
        } else if (rawStatus === 'Aceitado' || rawStatus === 'Aprovado') {
          hookData.cell.text = ['Aceito'];
          rawStatus = 'Aceito';
        }

        const color = STATUS_TEXT_COLORS[rawStatus];
        if (color) {
          hookData.cell.styles.textColor = color;
        }
      }

      // Destacar mensagens "Não Lidas"
      if (hookData.section === 'body') {
        const rowData = hookData.row.raw;
        if (rowData && rowData.isUnread) {
          if (hookData.column.dataKey === 'name') {
            // Nome em azul clássico profissional para denotar pendência de leitura
            hookData.cell.styles.textColor = [37, 99, 235]; 
          }
        }
      }
    },
  });
}

// ── Desenhar Rodapé ─────────────────────────────────────────
function drawFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Linha divisória superior do rodapé
    doc.setDrawColor(...COLORS.slate200);
    doc.setLineWidth(0.1);
    doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

    // Texto da esquerda
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.slate500);
    doc.text(
      'ALEM — Associação de Luta e Esperança de Moçambique  |  Documento Interno Confidencial',
      14,
      pageHeight - 9
    );

    // Paginação à direita
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - 14,
      pageHeight - 9,
      { align: 'right' }
    );
  }
}

// ════════════════════════════════════════════════════════════
// EXPORTAÇÃO PRINCIPAL
// ════════════════════════════════════════════════════════════

export function exportSupportPDF(filteredMessages, {
  readFilter = 'Todos',
  search = '',
  filterStart = '',
  filterEnd = '',
} = {}) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cálculo das estatísticas simplificado
  const stats = {
    total:     filteredMessages.length,
    pendentes: filteredMessages.filter(m => m.status === 'Pendente').length,
    emAnalise: filteredMessages.filter(m => m.status === 'Em Analise').length,
    aceitos:   filteredMessages.filter(m =>
      m.status === 'Aceito' || m.status === 'Aprovado' || m.status === 'Aceitado'
    ).length,
  };

  // Composição sequencial do documento
  let y = drawHeader(doc, pageWidth);
  y = drawMetaInfo(doc, y, { readFilter, search, filterStart, filterEnd });
  y = drawStatCards(doc, y, stats, pageWidth);
  drawTable(doc, y, filteredMessages);
  drawFooter(doc);

  // Salvar ficheiro com timestamp e filtros
  const dateSuffix = new Date().toISOString().split('T')[0];
  const filterSuffix = (filterStart || filterEnd)
    ? `_${filterStart || 'inicio'}_a_${filterEnd || 'hoje'}`
    : '';
  doc.save(`pedidos_apoio_${dateSuffix}${filterSuffix}.pdf`);
}
