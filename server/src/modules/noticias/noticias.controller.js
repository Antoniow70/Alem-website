import * as noticiasService from './noticias.service.js';

export async function getNews(req, res, next) {
  try {
    const data = await noticiasService.getNews();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getNewsById(req, res, next) {
  try {
    const { id } = req.params;
    const data = await noticiasService.getNewsById(id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createNews(req, res, next) {
  try {
    const data = await noticiasService.createNews(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateNews(req, res, next) {
  try {
    const { id } = req.params;
    const data = await noticiasService.updateNews(id, req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteNews(req, res, next) {
  try {
    const { id } = req.params;
    await noticiasService.deleteNews(id);
    res.json({ success: true, message: 'Notícia eliminada com sucesso.' });
  } catch (error) {
    next(error);
  }
}
