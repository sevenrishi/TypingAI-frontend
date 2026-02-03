import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { CheckCircle, Keyboard, X, Trophy, Play, Zap } from 'lucide-react';
import TextDisplay from '../features/typing/components/TextDisplay';

interface Lesson {
  id: number;
  title: string;
  phase: string;
  description: string;
  content: string[];
  completed: boolean;
}

const lessons: Lesson[] = [
  // PHASE 1 – KEYBOARD MASTERY
  {
    id: 1,
    title: 'Home Row Basics',
    phase: 'Phase 1: Keyboard Mastery',
    description: 'Keys: A S D F   J K L ; - Fingers return to home row after every press',
    content: [
      'asdf ;lkj',
      'asdfg ;lkjh',
      'fjfj fjfj',
      'dkdk dkdk',
      'asdf ;lkj asdf ;lkj'
    ],
    completed: false
  },
  {
    id: 2,
    title: 'Upper Row',
    phase: 'Phase 1: Keyboard Mastery',
    description: 'Keys: Q W E R T Y U I O P',
    content: [
      'qwert poiuy',
      'qq ww ee rr tt yy uu ii oo pp',
      'asdf qwer ;lkj poiuy',
      'quit wipe tire your pure',
      'quote write tower power'
    ],
    completed: false
  },
  {
    id: 3,
    title: 'Home Row Word Practice',
    phase: 'Phase 1: Keyboard Mastery',
    description: 'Build words using home row keys',
    content: [
      'all fall hall ash salsa glass',
      'add dad sad lad fad',
      'ask flask desk task',
      'all fall hall ash salsa glass'
    ],
    completed: false
  },
  {
    id: 4,
    title: 'Bottom Row',
    phase: 'Phase 1: Keyboard Mastery',
    description: 'Keys: Z X C V B N M , . /',
    content: [
      'zxcv bnm,./',
      'asdf zxcv ;lkj nm,./',
      'zoom mix cave vine bone name',
      'zebra mixer carbon vine bone name'
    ],
    completed: false
  },
  {
    id: 5,
    title: 'Mixed Row Words',
    phase: 'Phase 1: Keyboard Mastery',
    description: 'Combine all rows for real words',
    content: [
      'we he up drip shift tray twister',
      'figures times quality master',
      'the quick brown fox jumps',
      'typing skills improve with practice'
    ],
    completed: false
  },
  {
    id: 6,
    title: 'Alphabet & Pangram',
    phase: 'Phase 1: Keyboard Mastery',
    description: 'Complete alphabet and famous pangram',
    content: [
      'abcdefghijklmnopqrstuvwxyz',
      'a quick brown fox jumps over the lazy dog',
      'the five boxing wizards jump quickly',
      'pack my box with five dozen liquor jugs'
    ],
    completed: false
  },
  {
    id: 7,
    title: 'Number Row',
    phase: 'Phase 1: Keyboard Mastery',
    description: 'Master the numbers 0-9',
    content: [
      '1 2 3 4 5 6 7 8 9 0',
      '123 456 789 0',
      '10 20 30 40 50 60 70 80 90',
      '2024 1234 5678 9012'
    ],
    completed: false
  },
  {
    id: 8,
    title: 'Shift & Symbols',
    phase: 'Phase 1: Keyboard Mastery',
    description: 'Capitals and special characters',
    content: [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '! @ # $ % ^ & * ( )',
      '; :  \' "  , <  . >  / ?',
      'Hello World! How Are You?'
    ],
    completed: false
  },
  // PHASE 2 – AI SKILL DEVELOPMENT
  {
    id: 9,
    title: 'Weak Finger Booster',
    phase: 'Phase 2: AI Skill Development',
    description: 'Strengthen pinky and ring fingers',
    content: [
      ';p ;p ;p ;p',
      'lolololo',
      'zxzxzxzx',
      'tytytyty',
      'papa lala zaza tata'
    ],
    completed: false
  },
  {
    id: 10,
    title: 'Confusion Pair Drills',
    phase: 'Phase 2: AI Skill Development',
    description: 'Practice commonly confused keys',
    content: [
      'ioiiooioi',
      'mnmnmnmn',
      ',.,.,.,.', 
      ';l;l;l;l',
      'minimum opinion common mission'
    ],
    completed: false
  },
  {
    id: 11,
    title: 'Accuracy Control',
    phase: 'Phase 2: AI Skill Development',
    description: 'Focus on precision over speed',
    content: [
      'the that those these there',
      'fast fingers fail when focus fades',
      'accuracy always beats speed',
      'precision practice prevents poor performance'
    ],
    completed: false
  },
  {
    id: 12,
    title: 'Rhythm Training',
    phase: 'Phase 2: AI Skill Development',
    description: 'Develop consistent typing rhythm',
    content: [
      'tap tap tap tap stop',
      'flow and go and flow again',
      'space timing builds typing rhythm',
      'steady beats speedy every time'
    ],
    completed: false
  },
  {
    id: 13,
    title: 'Real World Typing',
    phase: 'Phase 2: AI Skill Development',
    description: 'Practice actual formats: emails, URLs, passwords',
    content: [
      'saptarshi.mondal@gmail.com',
      'T@yping2026!',
      'https://typingai.app',
      'project_report_v2_final.docx'
    ],
    completed: false
  },
  {
    id: 14,
    title: 'Blind Typing Mode',
    phase: 'Phase 2: AI Skill Development',
    description: 'Type without looking at keyboard or screen',
    content: [
      'trust your muscle memory now',
      'fingers know the way home',
      'blind typing builds confidence',
      'memory guides accurate typing'
    ],
    completed: false
  },
  // PHASE 3 – PERFORMANCE
  {
    id: 15,
    title: 'Speed Stage 1 (20 WPM)',
    phase: 'Phase 3: Performance',
    description: '1-minute typing test - Target 20 WPM',
    content: [
      'the quick brown fox jumps over the lazy dog near the riverbank where the old tree stands tall and proud in the morning sunshine'
    ],
    completed: false
  },
  {
    id: 16,
    title: 'Speed Stage 2 (30 WPM)',
    phase: 'Phase 3: Performance',
    description: '1-minute typing test - Target 30 WPM',
    content: [
      'typing skills improve with daily practice and dedication to proper technique always remember to keep your fingers on the home row and return after each keystroke for maximum efficiency and speed'
    ],
    completed: false
  },
  {
    id: 17,
    title: 'Speed Stage 3 (40+ WPM)',
    phase: 'Phase 3: Performance',
    description: '1-minute typing test - Target 40+ WPM',
    content: [
      'mastering touch typing requires patience persistence and practice every single day you must focus on accuracy first then gradually increase your speed while maintaining proper form and technique the rewards will come with time and effort'
    ],
    completed: false
  },
  {
    id: 18,
    title: 'Endurance Test',
    phase: 'Phase 3: Performance',
    description: '5-minute continuous typing marathon',
    content: [
      'welcome to the endurance test where stamina meets skill this extended practice session will challenge your ability to maintain consistent typing speed and accuracy over a longer period remember to keep breathing deeply stay relaxed in your shoulders and maintain proper posture throughout the entire exercise your fingers should move smoothly and rhythmically across the keyboard finding the keys automatically through muscle memory that you have developed through all the previous lessons this final challenge will prove your dedication to mastering the art of touch typing'
    ],
    completed: false
  }
];

export default function LearnPage() {
  const { theme } = useTheme();
  const [selectedLesson, setSelectedLesson] = useState<number>(1);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load completed lessons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      setCompletedLessons(new Set(JSON.parse(saved)));
    }
  }, []);

  // Close practice screen when lesson changes
  const handleLessonSelect = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setIsPracticing(false);
    setTyped('');
    setCurrentLineIndex(0);
    setStartTime(null);
    setErrors(0);
  };

  const currentLesson = lessons.find(l => l.id === selectedLesson);
  const currentText = currentLesson?.content[currentLineIndex] || '';
  const progressPercentage = Math.round((completedLessons.size / lessons.length) * 100);

  const handleStartPractice = () => {
    setIsPracticing(true);
    setCurrentLineIndex(0);
    setTyped('');
    setStartTime(Date.now());
    setErrors(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleChange = (value: string) => {
    if (!startTime) setStartTime(Date.now());
    
    // Check for errors
    const currentChar = currentText[typed.length];
    const typedChar = value[value.length - 1];
    if (typedChar && currentChar && typedChar !== currentChar) {
      setErrors(prev => prev + 1);
    }

    setTyped(value);

    // Check if line is complete
    if (value === currentText) {
      if (currentLesson && currentLineIndex < currentLesson.content.length - 1) {
        // Move to next line
        setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setTyped('');
        }, 500);
      } else {
        // Lesson complete
        handleCompleteLesson();
      }
    }
  };

  const handleCompleteLesson = () => {
    const updated = new Set(completedLessons);
    updated.add(selectedLesson);
    setCompletedLessons(updated);
    localStorage.setItem('completedLessons', JSON.stringify([...updated]));
    setIsPracticing(false);
    setTyped('');
    setCurrentLineIndex(0);
  };

  const handleClosePractice = () => {
    setIsPracticing(false);
    setTyped('');
    setCurrentLineIndex(0);
    setStartTime(null);
    setErrors(0);
  };

  const accuracy = typed.length > 0 
    ? Math.round(((typed.length - errors) / typed.length) * 100) 
    : 100;

  const bgClass = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900';
  const sidebarClass = theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200';
  const contentClass = theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200';
  const progressBarBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';

  // Group lessons by phase
  const phase1 = lessons.filter(l => l.id <= 8);
  const phase2 = lessons.filter(l => l.id >= 9 && l.id <= 14);
  const phase3 = lessons.filter(l => l.id >= 15);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-center">Typing AI Curriculum</h1>
        <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Master touch typing through 18 structured lessons
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div 
            className={`lg:col-span-1 rounded-lg p-6 transition-colors duration-300 ${sidebarClass} max-h-[calc(100vh-10px)] overflow-y-auto`}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: theme === 'dark' ? '#4B5563 #1F2937' : '#D1D5DB #F3F4F6',
              WebkitScrollbarWidth: 'thin'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 6px;
              }
              div::-webkit-scrollbar-track {
                background: ${theme === 'dark' ? '#1F2937' : '#F3F4F6'};
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb {
                background: ${theme === 'dark' ? '#4B5563' : '#D1D5DB'};
                border-radius: 3px;
              }
              div::-webkit-scrollbar-thumb:hover {
                background: ${theme === 'dark' ? '#6B7280' : '#9CA3AF'};
              }
            `}</style>
            <h2 className="text-xl font-bold mb-4">Course Progress</h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall</span>
                <span className="text-sm font-bold text-blue-500">{progressPercentage}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${progressBarBgClass}`}>
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Phase 1 */}
            <div className="mb-6">
              <h3 className={`text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                Phase 1: Keyboard Mastery
              </h3>
              <div className="space-y-2">
                {phase1.map(lesson => {
                  const isSelected = selectedLesson === lesson.id;
                  const isCompleted = completedLessons.has(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson.id)}
                      className={`w-full text-left p-2 rounded-lg transition-all duration-200 text-sm ${
                        isSelected
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-900'
                          : theme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Keyboard className="w-4 h-4" />
                          <span className="font-medium">{lesson.id}. {lesson.title}</span>
                        </div>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phase 2 */}
            <div className="mb-6">
              <h3 className={`text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                Phase 2: Skill Development
              </h3>
              <div className="space-y-2">
                {phase2.map(lesson => {
                  const isSelected = selectedLesson === lesson.id;
                  const isCompleted = completedLessons.has(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson.id)}
                      className={`w-full text-left p-2 rounded-lg transition-all duration-200 text-sm ${
                        isSelected
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-900'
                          : theme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          <span className="font-medium">{lesson.id}. {lesson.title}</span>
                        </div>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Phase 3 */}
            <div>
              <h3 className={`text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                Phase 3: Performance
              </h3>
              <div className="space-y-2">
                {phase3.map(lesson => {
                  const isSelected = selectedLesson === lesson.id;
                  const isCompleted = completedLessons.has(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson.id)}
                      className={`w-full text-left p-2 rounded-lg transition-all duration-200 text-sm ${
                        isSelected
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-900'
                          : theme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          <span className="font-medium">{lesson.id}. {lesson.title}</span>
                        </div>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`lg:col-span-3 rounded-lg p-8 transition-colors duration-300 ${contentClass}`}>
            {currentLesson && !isPracticing && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold">Lesson {currentLesson.id}: {currentLesson.title}</h2>
                    {completedLessons.has(currentLesson.id) && (
                      <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Completed</span>
                      </div>
                    )}
                  </div>
                  <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {currentLesson.description}
                  </p>
                </div>

                <div className={`mb-6 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <h3 className="text-xl font-bold mb-4">Practice Text:</h3>
                  <div className="space-y-3">
                    {currentLesson.content.map((line, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg font-mono text-lg ${
                          theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-800'
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartPractice}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <Play className="w-6 h-6" />
                  Start Practice
                </button>

                {/* Navigation */}
                <div className="flex gap-4 mt-6">
                  {selectedLesson > 1 && (
                    <button
                      onClick={() => handleLessonSelect(selectedLesson - 1)}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      ← Previous Lesson
                    </button>
                  )}
                  {selectedLesson < 18 && (
                    <button
                      onClick={() => handleLessonSelect(selectedLesson + 1)}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Next Lesson →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Practice Screen */}
            {currentLesson && isPracticing && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Lesson {currentLesson.id}: {currentLesson.title}</h2>
                  <button
                    onClick={handleClosePractice}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Exercise {currentLineIndex + 1} of {currentLesson.content.length}</span>
                    <span className="text-sm font-medium">Accuracy: {accuracy}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${progressBarBgClass}`}>
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${((currentLineIndex + (typed.length / currentText.length)) / currentLesson.content.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Text Display */}
                <div className={`w-full rounded-lg border p-6 min-h-32 mb-4 flex items-center transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800'
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  <div className="w-full">
                    <TextDisplay text={currentText} typed={typed} />
                  </div>
                </div>

                {/* Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={typed}
                  onChange={(e) => handleChange(e.target.value)}
                  onPaste={(e) => e.preventDefault()}
                  className={`w-full p-4 rounded-lg border text-lg font-mono transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Type here..."
                  autoFocus
                />

                {/* Stats */}
                <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Errors</div>
                      <div className="text-2xl font-bold text-red-500">{errors}</div>
                    </div>
                    <div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Characters</div>
                      <div className="text-2xl font-bold text-blue-500">{typed.length}/{currentText.length}</div>
                    </div>
                    <div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
                      <div className={`text-2xl font-bold ${accuracy >= 95 ? 'text-green-500' : accuracy >= 80 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {accuracy}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
