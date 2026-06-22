import * as reportsService from './reports.service.js';

export async function getConsolidatedReport(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const pdfBuffer = await reportsService.generateReportPDF(startDate, endDate);
    
    const filename = `relatorio_consolidado_${startDate}_a_${endDate}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}
