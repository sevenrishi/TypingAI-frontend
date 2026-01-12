import { Request, Response } from 'express';
import User from '../models/User';
import TestResult from '../models/TestResult';
import { AuthRequest } from '../middleware/auth';

export async function getProfile(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const user = await User.findById(userId).select('-passwordHash').populate('history');
  if (!user) return res.status(404).json({ error: 'User not found' });

  // compute aggregate stats if needed
  const stats = await TestResult.find({ user: user._id }).sort({ createdAt: -1 }).limit(50);
  const avgAccuracy = stats.length ? (stats.reduce((s, r) => s + r.accuracy, 0) / stats.length) : 0;
  const bestWPM = stats.length ? Math.max(...stats.map(s => s.wpm)) : 0;

  return res.json({ user, bestWPM, averageAccuracy: avgAccuracy });
}
