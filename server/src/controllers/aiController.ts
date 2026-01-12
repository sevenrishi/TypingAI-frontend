import { Request, Response } from 'express';
import { generateText } from '../utils/aiService';

export async function generate(req: Request, res: Response) {
  const { topic, length, difficulty } = req.body;

  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "topic"' });
  }

  const allowed = ['short', 'medium', 'long'];
  if (!allowed.includes(length)) {
    return res.status(400).json({ error: 'Invalid "length"; must be short|medium|long' });
  }

  try {
    const text = await generateText(topic, length, difficulty || 'medium');
    return res.json({ text });
  } catch (err: any) {
    console.error('AI generate error', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate text' });
  }
}
