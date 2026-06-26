import { Router } from 'express';
import * as documentosController from './documentos.controller.js';
import { createDocumentSchema, updateDocumentSchema } from './documentos.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

router.get('/', documentosController.getDocuments);
router.post('/', authGuard, adminOnly, validate(createDocumentSchema), documentosController.createDocument);
router.put('/:id', authGuard, adminOnly, validate(updateDocumentSchema), documentosController.updateDocument);
router.delete('/:id', authGuard, adminOnly, documentosController.deleteDocument);

export default router;
