import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { login, getUserData, authorizedAccess } from '../controllers/authController.js';

const router = Router();

// Login endpoint - POST /api/login
router.post('/', login);

// Protected route - GET /api/login/authenticate
// Først kører authenticateToken (tjekker om token er gyldig)
// Hvis token er OK, kører getUserData og returnerer brugerens data
router.get('/authenticate', authenticateToken, getUserData);

// Protected authorized access - GET /api/login/authorized
router.get('/authorized', authenticateToken, authorizedAccess);

export { router as loginRoutes };