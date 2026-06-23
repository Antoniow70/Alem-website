import * as reportsService from './reports.service.js';

export async function getConsolidatedReport(req, res, next) {
  try {
    const { startDate, endDate, type = 'consolidated' } = req.query;
    const pdfBuffer = await reportsService.generateReportPDF(startDate, endDate, type);
    
    let filename = `relatorio_consolidado_${startDate}_a_${endDate}.pdf`;
    if (type === 'volunteers') {
      filename = `relatorio_voluntarios_${startDate}_a_${endDate}.pdf`;
    } else if (type === 'support') {
      filename = `relatorio_pedidos_apoio_${startDate}_a_${endDate}.pdf`;
    } else if (type === 'donations') {
      filename = `relatorio_doacoes_${startDate}_a_${endDate}.pdf`;
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
