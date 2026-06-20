import * as equipaService from './equipa.service.js';

export async function getTeam(req, res, next) {
  try {
    const data = await equipaService.getTeam();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createTeamMember(req, res, next) {
  try {
    const data = await equipaService.createTeamMember(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateTeamMember(req, res, next) {
  try {
    const { id } = req.params;
    const data = await equipaService.updateTeamMember(id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteTeamMember(req, res, next) {
  try {
    const { id } = req.params;
    await equipaService.deleteTeamMember(id);
    res.json({ success: true, message: 'Membro da equipa eliminado com sucesso.' });
  } catch (error) {
    next(error);
  }
}
