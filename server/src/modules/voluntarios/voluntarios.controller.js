import * as voluntariosService from './voluntarios.service.js';

export async function getVolunteers(req, res, next) {
  try {
    const { status, read_status, dateFrom, dateTo, search, page, pageSize } = req.query;
    const result = await voluntariosService.getVolunteers({ status, read_status, dateFrom, dateTo, search, page, pageSize });
    res.json({ success: true, data: result.data, count: result.count });
  } catch (error) {
    next(error);
  }
}

export async function deleteVolunteer(req, res, next) {
  try {
    const { id } = req.params;
    await voluntariosService.deleteVolunteer(id);
    res.json({ success: true, message: 'Voluntário eliminado com sucesso.' });
  } catch (error) {
    next(error);
  }
}

export async function updateVolunteerStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await voluntariosService.updateVolunteerStatus(id, status);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function markVolunteerRead(req, res, next) {
  try {
    const { id } = req.params;
    const data = await voluntariosService.markVolunteerRead(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function bulkUpdateVolunteerStatus(req, res, next) {
  try {
    const { ids, status } = req.body;
    const data = await voluntariosService.bulkUpdateVolunteerStatus(ids, status);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function submitVolunteer(req, res, next) {
  try {
    const data = await voluntariosService.submitVolunteer(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
