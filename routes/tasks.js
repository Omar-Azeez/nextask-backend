// routes/tasks.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const TASKS_FILE = path.join(__dirname, '../data/tasks.json');

// Helper: Read and write task data
const readTasks = () => {
  if (!fs.existsSync(TASKS_FILE)) return [];
  const data = fs.readFileSync(TASKS_FILE);
  return JSON.parse(data);
};

const writeTasks = (tasks) => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// ✅ Create a new task
router.post('/', (req, res) => {
  const { userId, title, description, priority } = req.body;
  if (!userId || !title) {
    return res.status(400).json({ message: 'userId and title are required' });
  }

  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(), // store as string to match frontend
    userId: userId.toString(), // keep consistent type
    title,
    description: description || '',
    priority: priority || 'medium',
    completed: false
  };

  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// ✅ Get all tasks for a specific user
router.get('/:userId', (req, res) => {
  const userId = req.params.userId.toString();
  const tasks = readTasks().filter((task) => task.userId === userId);
  res.json(tasks);
});

// ✅ Update a task (edit or mark complete)
router.put('/:taskId', (req, res) => {
  const taskId = req.params.taskId.toString();
  const { title, description, priority, completed } = req.body;

  const tasks = readTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return res.status(404).json({ message: 'Task not found' });

  tasks[index] = {
    ...tasks[index],
    title: title ?? tasks[index].title,
    description: description ?? tasks[index].description,
    priority: priority ?? tasks[index].priority,
    completed: completed ?? tasks[index].completed
  };

  writeTasks(tasks);
  res.json(tasks[index]);
});

// ✅ Delete a task
router.delete('/:taskId', (req, res) => {
  const taskId = req.params.taskId.toString();
  const tasks = readTasks();
  const filtered = tasks.filter((t) => t.id !== taskId);

  if (tasks.length === filtered.length) {
    return res.status(404).json({ message: 'Task not found' });
  }

  writeTasks(filtered);
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
