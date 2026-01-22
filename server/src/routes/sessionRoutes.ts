import { Router, Request, Response } from 'express';
import Session from '../models/Session';
import User from '../models/User';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Create a new session (practice/test/battle result)
router.post('/create', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { type, wpm, cpm, accuracy, errors, duration, text, difficulty, mode, battleResult, opponent } = req.body;

    const session = new Session({
      user: userId,
      type,
      wpm,
      cpm,
      accuracy,
      errors,
      duration,
      text,
      difficulty,
      mode,
      battleResult,
      opponent
    });

    await session.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      user.sessions.push(session._id);
      
      // Update counts
      if (type === 'test') {
        user.totalTestsTaken = (user.totalTestsTaken || 0) + 1;
      } else if (type === 'practice') {
        user.totalPracticeSessions = (user.totalPracticeSessions || 0) + 1;
      } else if (type === 'battle') {
        user.totalBattles = (user.totalBattles || 0) + 1;
      }

      // Update best WPM
      if (wpm > (user.bestWPM || 0)) {
        user.bestWPM = wpm;
      }

      // Update average accuracy
      const allSessions = await Session.find({ user: userId });
      const avgAccuracy = allSessions.reduce((sum, s) => sum + s.accuracy, 0) / allSessions.length;
      user.averageAccuracy = Math.round(avgAccuracy);

      await user.save();
    }

    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get user sessions with pagination
router.get('/user/:userId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { type, page = '1', limit = '10' } = req.query;

    let query: any = { user: userId };
    if (type) query.type = type;

    const sessions = await Session.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string) * 1)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .lean();

    const total = await Session.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get session stats summary
router.get('/stats/:userId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const testSessions = await Session.find({ user: userId, type: 'test' }).lean();
    const practiceSessions = await Session.find({ user: userId, type: 'practice' }).lean();
    const battleSessions = await Session.find({ user: userId, type: 'battle' }).lean();

    const calculateStats = (sessions: any[]) => {
      if (sessions.length === 0) return { count: 0, avgWPM: 0, avgAccuracy: 0, totalDuration: 0 };
      
      return {
        count: sessions.length,
        avgWPM: Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length),
        avgAccuracy: Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length),
        totalDuration: sessions.reduce((sum, s) => sum + s.duration, 0)
      };
    };

    res.json({
      user: {
        displayName: user.displayName,
        bestWPM: user.bestWPM,
        averageAccuracy: user.averageAccuracy
      },
      stats: {
        tests: calculateStats(testSessions),
        practice: calculateStats(practiceSessions),
        battles: calculateStats(battleSessions)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get single session details
router.get('/:sessionId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).lean();

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

export default router;
