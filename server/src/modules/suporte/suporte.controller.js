import * as suporteService from './suporte.service.js';

export async function getMessages(req, res, next) {
  try {
    const { status, read_status, dateFrom, dateTo, search, page, pageSize } = req.query;
    const result = await suporteService.getMessages({ status, read_status, dateFrom, dateTo, search, page, pageSize });
    res.json({ success: true, data: result.data, count: result.count });
  } catch (error) {
    next(error);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;
    await suporteService.deleteMessage(id);
    res.json({ success: true, message: 'Mensagem eliminada com sucesso.' });
  } catch (error) {
    next(error);
  }
}

export async function updateMessageStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await suporteService.updateMessageStatus(id, status);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function markMessageRead(req, res, next) {
  try {
    const { id } = req.params;
    const data = await suporteService.markMessageRead(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function bulkUpdateMessageStatus(req, res, next) {
  try {
    const { ids, status } = req.body;
    const data = await suporteService.bulkUpdateMessageStatus(ids, status);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function submitMessage(req, res, next) {
  try {
    const data = await suporteService.submitMessage(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
