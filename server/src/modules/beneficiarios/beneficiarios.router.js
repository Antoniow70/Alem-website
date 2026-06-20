import { Router } from 'express';
import * as beneficiariosController from './beneficiarios.controller.js';
import { createStorySchema, updateStorySchema } from './beneficiarios.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

router.get('/', beneficiariosController.getStories);
router.post('/', authGuard, adminOnly, validate(createStorySchema), beneficiariosController.createStory);
router.put('/:id', authGuard, adminOnly, validate(updateStorySchema), beneficiariosController.updateStory);
router.delete('/:id', authGuard, adminOnly, beneficiariosController.deleteStory);

export default router;
