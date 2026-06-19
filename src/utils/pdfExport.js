import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export donations data as a PDF report.
 * Extracted from Admin.jsx exportDonationsPDF().
 */
export function exportDonationsPDF(filteredDonations, { filterStart, filterEnd }) {
  const filtered = filteredDonations;
  const doc = new jsPDF({ orientation: 'landscape' });

  // Header
  doc.setFillColor(20, 33, 61);
  doc.rect(0, 0, 297, 38, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatorio de Doadores – ALEM', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const periodText = filterStart || filterEnd
    ? `Periodo: ${filterStart ? new Date(filterStart + 'T00:00:00').toLocaleDateString('pt-PT') : 'Inicio'} – ${filterEnd ? new Date(filterEnd + 'T00:00:00').toLocaleDateString('pt-PT') : 'Hoje'}`
    : 'Todos os registos';
  doc.text(periodText, 14, 27);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 33);

  // Stats summary
  const totalAmount = filtered.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
  doc.setTextColor(20, 33, 61);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Total de Doacoes: ${filtered.length}     |     Valor Total: MT ${totalAmount.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`,
    14, 50
  );

  // Table with date+time and message
  const tableColumn = ['#', 'Nome Completo', 'Email', 'Telefone', 'Causa', 'Valor (MZN)', 'Pagamento', 'Data & Hora', 'Mensagem'];
  const tableRows = filtered.map((d, idx) => {
    const donDate = d.created_at ? new Date(d.created_at) : null;
    const isValidDate = donDate && !isNaN(donDate.getTime());
    const dateStr = isValidDate
      ? `${donDate.toLocaleDateString('pt-PT')} ${donDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`
      : 'N/D';
    return [
      String(filtered.length - idx),
      d.nome || '',
      d.email || '',
      d.telefone || '',
      d.causa || '',
      `MT ${parseFloat(d.valor || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`,
      d.metodo_pagamento || '',
      dateStr,
      d.mensagem || '—',
    ];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 56,
    styles: { fontSize: 7.5, cellPadding: 3, overflow: 'linebreak' },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      5: { halign: 'right', fontStyle: 'bold', cellWidth: 28 },
      6: { cellWidth: 22 },
      7: { cellWidth: 30 },
      8: { cellWidth: 40 },
    },
  });

  // Footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `ALEM – Alem das Barreiras  |  Pagina ${i} de ${pageCount}`,
      14,
      doc.internal.pageSize.height - 10
    );
  }

  const suffix = (filterStart || filterEnd)
    ? `_${filterStart || 'inicio'}_a_${filterEnd || 'hoje'}`
    : '_todos';
  doc.save(`doadores${suffix}.pdf`);
}

/**
 * Export volunteers data as a PDF report.
 * Extracted from Admin.jsx exportVolunteersPDF().
 */
export function exportVolunteersPDF(filteredVolunteers, { readFilter, search }) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const tableColumn = ["Nome", "Genero", "Telefone", "Email", "Endereco", "Interesse", "Data", "Estado"];
  const tableRows = [];

  filteredVolunteers.forEach(vol => {
    const volunteerData = [
      vol.full_name || '',
      vol.genero || '',
      vol.phone || '',
      vol.email || '',
      vol.endereco || '',
      vol.area_interesse || '',
      vol.created_at ? new Date(vol.created_at).toLocaleDateString('pt-PT') : '',
      vol.status || ''
    ];
    tableRows.push(volunteerData);
  });

  doc.setFillColor(20, 33, 61);
  doc.rect(0, 0, 297, 38, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("Relatorio de Voluntarios - ALEM", 14, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Filtros: ${readFilter} | ${search ? 'Pesquisa: ' + search : ''}`, 14, 27);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 33);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
    headStyles: { fillColor: [37, 99, 235] },
    columnStyles: { 5: { cellWidth: 30 } }
  });

  doc.save(`voluntarios_${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Export support messages data as a PDF report.
 * Extracted from Admin.jsx exportSupportPDF().
 */
export function exportSupportPDF(filteredMessages, { readFilter, search }) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const tableColumn = ["Nome", "Genero", "Nascimento", "Contacto", "Email", "Endereco", "Apoio/Necessidade", "Data", "Estado"];
  const tableRows = [];

  filteredMessages.forEach(msg => {
    const messageData = [
      msg.name || '',
      msg.genero || '',
      msg.data_nascimento ? new Date(msg.data_nascimento).toLocaleDateString('pt-PT') : '',
      msg.phone || '',
      msg.email || '',
      msg.endereco || '',
      msg.subject || '',
      msg.created_at ? new Date(msg.created_at).toLocaleDateString('pt-PT') : '',
      msg.status || ''
    ];
    tableRows.push(messageData);
  });

  doc.setFillColor(20, 33, 61);
  doc.rect(0, 0, 297, 38, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("Relatorio de Pedidos de Apoio - ALEM", 14, 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Filtros: ${readFilter} | ${search ? 'Pesquisa: ' + search : ''}`, 14, 27);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 14, 33);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
    headStyles: { fillColor: [37, 99, 235] },
    columnStyles: { 5: { cellWidth: 30 }, 6: { cellWidth: 30 } }
  });

  doc.save(`pedidos_apoio_${new Date().toISOString().split('T')[0]}.pdf`);
}
