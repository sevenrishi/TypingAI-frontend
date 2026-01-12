import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function register(req: Request, res: Response) {
  const { email, password, displayName } = req.body;
  if (!password || typeof password !== 'string') return res.status(400).json({ error: 'Password required' });

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ email, passwordHash: hash, displayName });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, displayName: user.displayName, email: user.email } });
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: user._id, displayName: user.displayName, email: user.email } });
}
