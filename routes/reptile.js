import express from 'express';
import TaskControllers from '../controllers/task';
const router = express.Router();


router.get('/reptile',TaskControllers.reptileAllJob);

export default router;