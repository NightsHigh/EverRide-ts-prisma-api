import { Router } from 'express';
import { getUserData, login } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();


router.post('/login', login);

router.get('/authenticate', authenticateToken, getUserData);

export const authRoutes = router;

