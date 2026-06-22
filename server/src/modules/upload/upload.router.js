import { Router } from 'express';
import * as uploadController from './upload.controller.js';
import { uploadSchema } from './upload.schema.js';
import { validate } from '../../middleware/validate.js';
import { authGuard } from '../../middleware/authGuard.js';
import { adminOnly } from '../../middleware/adminOnly.js';

const router = Router();

router.post('/', authGuard, adminOnly, validate(uploadSchema), uploadController.uploadFile);

export default router;
