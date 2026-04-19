import { createShortURLController, getShortURLController } from '../controllers/shorten.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/shorten', createShortURLController);
router.get('/shorten/:hashValue', getShortURLController);
export default router;
