import { Router } from 'express';
import { getProfile, updateAvatar } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth, getProfile);
router.put('/avatar', requireAuth, updateAvatar);

export default router;
