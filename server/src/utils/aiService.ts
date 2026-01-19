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
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set');

  const range = lengthToWords(length);
  const prompt = `Write a single-paragraph passage for a typing test. Topic: "${topic}". Word count between ${range.min} and ${range.max}. Difficulty: ${difficulty}. Use clear sentences appropriate for a typing exercise. Do not include lists, headings, or line breaks.`;

  const body = {
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: 'You are a helpful text generator that creates short passages for typing practice.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 400,
    temperature: 0.7
  };

  try {
    const resp = await axios.post('https://api.groq.com/openai/v1/chat/completions', body, {
      headers: { 
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const content = resp.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content returned from Groq');

    return content.replace(/\s+/g, ' ').trim();
  } catch (err: any) {
    console.error('Groq API Error:', err.response?.data || err.message);
    throw err;
  }
}
