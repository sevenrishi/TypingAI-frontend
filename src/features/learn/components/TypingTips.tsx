import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface Tip {
  id: number;
  title: string;
  content: string;
  category: string;
}

const tips: Tip[] = [
  {
    id: 1,
    title: 'Maintain Good Posture',
    content: 'Sit with your back straight, feet flat on the floor, and keep your wrists elevated. This reduces fatigue and prevents injuries.',
    category: 'Posture',
  },
  {
    id: 2,
    title: 'Use All Fingers',
    content: 'Utilize all ten fingers for typing. This distributes the workload and increases your typing speed significantly.',
    category: 'Technique',
  },
  {
    id: 3,
    title: 'Take Regular Breaks',
    content: 'Rest your hands every 30-60 minutes to avoid repetitive strain injuries. Short breaks improve overall typing endurance.',
    category: 'Health',
  },
  {
    id: 4,
    title: 'Practice Regularly',
    content: 'Consistency is key. Practice 15-30 minutes daily for best results. Regular practice builds muscle memory faster.',
    category: 'Practice',
  },
  {
    id: 5,
    title: 'Focus on Accuracy First',
    content: 'Speed comes naturally with accuracy. Prioritize typing correctly over typing quickly. Accuracy builds the foundation for speed.',
    category: 'Mindset',
  },
  {
    id: 6,
    title: 'Minimize Errors',
    content: 'Reduce distractions and avoid looking at the keyboard. The fewer errors you make, the less time you waste correcting them.',
    category: 'Technique',
  },
];

export default function TypingTips() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const categories = [...new Set(tips.map(t => t.category))];
  const filteredTips = selectedCategory
    ? tips.filter(t => t.category === selectedCategory)
    : tips;

  return (
    <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-slate-900/70 border border-slate-700/60 backdrop-blur-xl'
        : 'bg-white/80 border border-slate-200'
    }`}>
      <h3 className="text-2xl font-bold mb-6">Pro Tips</h3>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full transition-colors duration-200 font-medium ${
            selectedCategory === null
              ? theme === 'dark'
                ? 'bg-cyan-400 text-slate-900'
                : 'bg-sky-600 text-white'
              : theme === 'dark'
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full transition-colors duration-200 font-medium ${
              selectedCategory === cat
                ? theme === 'dark'
                  ? 'bg-cyan-400 text-slate-900'
                  : 'bg-sky-600 text-white'
                : theme === 'dark'
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map(tip => (
          <div
            key={tip.id}
            className={`rounded-lg p-4 border transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-slate-900/50 border-slate-700'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-lg">{tip.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-200'
                  : 'bg-sky-100 text-sky-700'
              }`}>
                {tip.category}
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {tip.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
