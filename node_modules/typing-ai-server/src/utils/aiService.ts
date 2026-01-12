import axios from 'axios';

type LengthKey = 'short' | 'medium' | 'long';

function lengthToWords(key: LengthKey) {
  switch (key) {
    case 'short':
      return { min: 50, max: 70 };
    case 'medium':
      return { min: 120, max: 150 };
    case 'long':
      return { min: 250, max: 300 };
  }
}

export async function generateText(topic: string, length: LengthKey, difficulty = 'medium') {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const range = lengthToWords(length);
  const prompt = `Write a single-paragraph passage for a typing test. Topic: "${topic}". Word count between ${range.min} and ${range.max}. Difficulty: ${difficulty}. Use clear sentences appropriate for a typing exercise. Do not include lists, headings, or line breaks.`;

  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a helpful text generator that creates short passages for typing practice.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1000,
    temperature: 0.6
  };

  const resp = await axios.post('https://api.openai.com/v1/chat/completions', body, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  const content = resp.data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content returned from AI');

  // Trim and normalize whitespace
  return content.replace(/\s+/g, ' ').trim();
}
