const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get All Tasks
router.get('/', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Create Task
router.post('/', authMiddleware, async (req, res) => {
  const task = new Task({ ...req.body, userId: req.user.id });
  await task.save();
  res.status(201).json(task);
});

// Update Task
router.put('/:id', authMiddleware, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete Task
router.delete('/:id', authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
