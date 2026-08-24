import { createShortURLController, getShortURLController } from '../controllers/shorten.controller.js';
import { originGuard } from '../middlewares/origin-guard.js';
import { Router } from 'express';

const router = Router();

router.post('/shorten', originGuard, createShortURLController);
router.get('/shorten/:hashValue', getShortURLController);
export default router;
