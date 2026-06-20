import * as parceirosService from './parceiros.service.js';

export async function getPartners(req, res, next) {
  try {
    const data = await parceirosService.getPartners();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createPartner(req, res, next) {
  try {
    const data = await parceirosService.createPartner(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updatePartner(req, res, next) {
  try {
    const { id } = req.params;
    const data = await parceirosService.updatePartner(id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deletePartner(req, res, next) {
  try {
    const { id } = req.params;
    await parceirosService.deletePartner(id);
    res.json({ success: true, message: 'Parceiro eliminado com sucesso.' });
  } catch (error) {
    next(error);
  }
}
