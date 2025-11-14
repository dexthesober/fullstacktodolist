import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user';
import { sendResetEmail } from '../utils/email';

const router = express.Router();

function signToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

// register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, country } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash, country });
    const token = signToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, country: user.country } });
  } catch (err) { next(err); }
});

// login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, country: user.country } });
  } catch (err) { next(err); }
});

// forgot password (create reset token & send)
router.post('/forgot', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Missing email' });
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If user exists, reset email sent' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await user.save();

    try {
      await sendResetEmail(user.email, token);
      return res.json({ message: 'Reset email sent' });
    } catch (emailErr) {
      return res.json({ message: 'SMTP failed - use token to reset', token });
    }
  } catch (err) { next(err); }
});

// reset password
router.post('/reset', async (req, res, next) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user || user.resetToken !== token || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) { next(err); }
});

export default router;
