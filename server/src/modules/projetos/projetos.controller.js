import * as projetosService from './projetos.service.js';

export async function getPillars(req, res, next) {
  try {
    const data = await projetosService.getPillars();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getActivities(req, res, next) {
  try {
    const { pillarId } = req.query;
    const data = await projetosService.getActivities(pillarId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getAllActivities(req, res, next) {
  try {
    const data = await projetosService.getAllActivities();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getProjects(req, res, next) {
  try {
    const { activityId, status, search } = req.query;
    const data = await projetosService.getProjects({ activityId, status, search });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    const data = await projetosService.getProjectById(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req, res, next) {
  try {
    const data = await projetosService.createProject(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const data = await projetosService.updateProject(id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    await projetosService.deleteProject(id);
    res.json({ success: true, message: 'Projeto eliminado com sucesso.' });
  } catch (error) {
    next(error);
  }
}

export async function updateProjectStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await projetosService.updateProjectStatus(id, status);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
