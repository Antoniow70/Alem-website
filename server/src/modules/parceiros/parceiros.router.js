import { Router } from 'express';
import * as parceirosController from './parceiros.controller.js';
import { createPartnerSchema, updatePartnerSchema } from './parceiros.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

router.get('/', parceirosController.getPartners);
router.post('/', authGuard, adminOnly, validate(createPartnerSchema), parceirosController.createPartner);
router.put('/:id', authGuard, adminOnly, validate(updatePartnerSchema), parceirosController.updatePartner);
router.delete('/:id', authGuard, adminOnly, parceirosController.deletePartner);

export default router;
