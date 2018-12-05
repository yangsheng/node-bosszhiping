import express from 'express';
import TaskControllers from '../controllers/task';
const router = express.Router();


router.get('/reptile',TaskControllers.reptile);

export default router;