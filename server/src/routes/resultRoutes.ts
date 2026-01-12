import { Router } from 'express';
import { saveResult, getMyResults } from '../controllers/resultController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, saveResult);
router.get('/me', requireAuth, getMyResults);

export default router;
