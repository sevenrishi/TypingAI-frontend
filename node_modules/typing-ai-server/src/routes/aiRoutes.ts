import { Router } from 'express';
import { generate } from '../controllers/aiController';

const router = Router();

router.post('/generate', generate);

export default router;
