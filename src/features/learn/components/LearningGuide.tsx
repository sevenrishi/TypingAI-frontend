import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface LessonItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  duration: string;
}

const lessons: LessonItem[] = [
  {
    id: 1,
    title: 'Proper Hand Positioning',
    description: 'Learn the correct way to position your hands on the keyboard for maximum efficiency and reduced strain.',
    icon: '🖐️',
    duration: '5 min',
  },
  {
    id: 2,
    title: 'Touch Typing Fundamentals',
    description: 'Master the home row keys and develop muscle memory for faster typing without looking at the keyboard.',
    icon: '⌨️',
    duration: '8 min',
  },
  {
    id: 3,
    title: 'Improving Your Accuracy',
    description: 'Techniques to reduce typos and improve accuracy while maintaining speed.',
    icon: '🎯',
    duration: '6 min',
  },
  {
    id: 4,
    title: 'Speed Training Drills',
    description: 'Structured exercises designed to progressively increase your typing speed.',
    icon: '⚡',
    duration: '10 min',
  },
];

export default function LearningGuide() {
  const { theme } = useTheme();
  const [expandedLesson, setExpandedLesson] = React.useState<number | null>(null);

  return (
    <div className={`rounded-lg shadow-lg p-6 transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/40 backdrop-blur-md'
        : 'bg-white border border-gray-300'
    }`}>
      <h3 className="text-2xl font-bold mb-6">Learning Lessons</h3>
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
              theme === 'dark'
                ? expandedLesson === lesson.id
                  ? 'bg-indigo-600/20 border border-indigo-500/30'
                  : 'bg-gray-700/50 hover:bg-gray-700/70'
                : expandedLesson === lesson.id
                ? 'bg-indigo-50 border border-indigo-300'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <span className="text-3xl">{lesson.icon}</span>
                <div>
                  <h4 className="font-bold text-lg">{lesson.title}</h4>
                  {expandedLesson === lesson.id && (
                    <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {lesson.description}
                    </p>
                  )}
                </div>
              </div>
              <span className={`text-sm px-2 py-1 rounded ${
                theme === 'dark'
                  ? 'bg-gray-600 text-gray-200'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {lesson.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
