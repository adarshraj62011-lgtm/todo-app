const express = require('express');
const router = express.Router();
const {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTasks).post(protect, setTask);
router.route('/reorder').put(protect, reorderTasks);
router.route('/:id').delete(protect, deleteTask).put(protect, updateTask);

module.exports = router;
