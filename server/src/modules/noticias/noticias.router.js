import { Router } from 'express';
import * as noticiasController from './noticias.controller.js';
import { createNewsSchema, updateNewsSchema } from './noticias.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

router.get('/', noticiasController.getNews);
router.get('/:id', noticiasController.getNewsById);
router.post('/', authGuard, adminOnly, validate(createNewsSchema), noticiasController.createNews);
router.put('/:id', authGuard, adminOnly, validate(updateNewsSchema), noticiasController.updateNews);
router.delete('/:id', authGuard, adminOnly, noticiasController.deleteNews);

export default router;
