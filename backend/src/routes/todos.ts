import express from 'express';
import { requireAuth } from '../middleware/auth';
import { Todo } from '../models/todo';

const router = express.Router();

router.get('/', requireAuth, async (req: any, res, next) => {
  try {
    const todos = await Todo.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) { next(err); }
});

router.post('/', requireAuth, async (req: any, res, next) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Missing title' });
    const todo = await Todo.create({ userId: req.user._id, title, description, dueDate });
    res.status(201).json(todo);
  } catch (err) { next(err); }
});

router.put('/:id', requireAuth, async (req: any, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.userId.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Not found' });
    const { title, description, dueDate, completed } = req.body;
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (completed !== undefined) todo.completed = completed;
    await todo.save();
    res.json(todo);
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, async (req: any, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.userId.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Not found' });
    await todo.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

export default router;
