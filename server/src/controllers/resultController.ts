import { Request, Response } from 'express';
import TestResult from '../models/TestResult';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export async function saveResult(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { wpm, cpm, accuracy, errors, duration, text, room } = req.body;
  if (typeof wpm !== 'number' || typeof cpm !== 'number' || typeof accuracy !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    const result = new TestResult({ user: userId, wpm, cpm, accuracy, errors, duration, text, room });
    await result.save();

    // append to user history and update aggregates
    const user = await User.findById(userId);
    if (user) {
      user.history = user.history || [];
      user.history.push(result._id);
      // update bestWPM and averageAccuracy
      user.bestWPM = Math.max(user.bestWPM || 0, wpm);
      // averageAccuracy will be computed on profile read, keep as-is
      await user.save();
    }

    return res.json({ result });
  } catch (err) {
    console.error('saveResult error', err);
    return res.status(500).json({ error: 'Failed to save result' });
  }
}

export async function getMyResults(req: AuthRequest, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const results = await TestResult.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
    return res.json({ results });
  } catch (err) {
    console.error('getMyResults error', err);
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
}
