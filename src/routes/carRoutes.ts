import { Router } from 'express';
import { getRecords, getRecordById, createRecord, updateRecord, deleteRecord } from '../controllers/carController.js';

const router = Router();

router.get('/', getRecords);
router.get('/:id', getRecordById);
router.post('/', createRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export const carRoutes = router;
