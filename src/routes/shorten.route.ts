import { createShortURLController, getShortURLController } from '../controllers/shorten.controller.js';
import { originGuard } from '../middlewares/origin-guard.js';
import { Router } from 'express';

const router = Router();

// POST is restricted by origin guard
router.post('/shorten', originGuard, createShortURLController);
// GET is public (anyone can access shortened URLs)
router.get('/shorten/:hashValue', getShortURLController);
export default router;
