import { Router } from 'express';
import {
  createRecord,
  deleteRecord,
  getRecordById,
  getRecords,
  updateRecord
} from '../controllers/userController.js';

const router = Router();

router.get('/', getRecords);
router.get('/:id', getRecordById);
router.post('/', createRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export const userRoutes = router;

