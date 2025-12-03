import { Router } from 'express';
import { getUserData, login, authorizedAccess } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';

const router = Router();


router.post('/login', login);
router.get('/authenticate', authenticateToken, getUserData);
router.get('/authorize', authenticateToken, authorizeRoles('Admin'), authorizedAccess);

export const authRoutes = router;

