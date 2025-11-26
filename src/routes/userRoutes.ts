import { Router } from 'express';
import { getRecords } from '../controllers/userController.js';

const router = Router();
router.get('/', getRecords);
routes.post('/', createRecord);
export const userRoutes = router;
