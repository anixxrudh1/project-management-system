import express from 'express';
import { updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for individual tasks (update/delete)
// Creating/getting tasks is handled via projectRoutes to enforce project relation
router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
