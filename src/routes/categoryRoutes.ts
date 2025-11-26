import { Router } from 'express';
import { getRecords, getRecordById, createRecord, updateRecord, deleteRecord } from '../controllers/categoryController.js';

const router = Router();

router.get('/', getRecords);
router.get('/:id', getRecordById);
router.post('/', createRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export const categoryRoutes = router;

