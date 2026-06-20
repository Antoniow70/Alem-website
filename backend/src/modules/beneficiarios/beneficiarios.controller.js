import * as beneficiariosService from './beneficiarios.service.js';

export async function getStories(req, res, next) {
  try {
    const data = await beneficiariosService.getStories();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createStory(req, res, next) {
  try {
    const data = await beneficiariosService.createStory(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateStory(req, res, next) {
  try {
    const { id } = req.params;
    const data = await beneficiariosService.updateStory(id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteStory(req, res, next) {
  try {
    const { id } = req.params;
    await beneficiariosService.deleteStory(id);
    res.json({ success: true, message: 'História eliminada com sucesso.' });
  } catch (error) {
    next(error);
  }
}
