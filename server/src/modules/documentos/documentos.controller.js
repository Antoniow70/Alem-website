import * as documentosService from './documentos.service.js';

export async function getDocuments(req, res, next) {
  try {
    const data = await documentosService.getDocuments();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createDocument(req, res, next) {
  try {
    const data = await documentosService.createDocument(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateDocument(req, res, next) {
  try {
    const { id } = req.params;
    const data = await documentosService.updateDocument(id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteDocument(req, res, next) {
  try {
    const { id } = req.params;
    await documentosService.deleteDocument(id);
    res.json({ success: true, message: 'Documento eliminado com sucesso.' });
  } catch (error) {
    next(error);
  }
}
