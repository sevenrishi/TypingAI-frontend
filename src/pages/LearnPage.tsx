import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { CheckCircle, Keyboard, X, Trophy, Play, Zap } from 'lucide-react';
import TextDisplay from '../features/typing/components/TextDisplay';
import KeyboardFingerPlacement, { FINGER_LABELS, KEY_FINGER_MAP, SHIFT_BASE_MAP } from '../features/learn/components/KeyboardFingerPlacement';

interface Lesson {
  id: number;
  title: string;
  phase: string;
  description: string;
  content: string[];
  completed: boolean;
  focusKeys?: string[];
}

const HOME_ROW_KEYS = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
const UPPER_ROW_KEYS = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const BOTTOM_ROW_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];
const ALPHABET_KEYS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const NUMBER_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const SYMBOL_KEYS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ';', ':', "'", '"', ',', '<', '.', '>', '/', '?'];

const lessons: Lesson[] = [
  // GETTING STARTED
  {
    id: 0,
    title: 'Getting Started',
    phase: 'Introduction',
    description: 'Learn how to use the typing course effectively',
    content: [
      'Welcome to TypingAI! Follow the instructions below to get started.',
      'Use finger placement guides and practice exercises to improve.',
      'Focus on accuracy first, speed will come naturally.',
      'Complete each lesson to unlock the next level.'
    ],
    completed: false
  },
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
    focusKeys: [...HOME_ROW_KEYS, 'g', 'h'],
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
    focusKeys: UPPER_ROW_KEYS,
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
    focusKeys: HOME_ROW_KEYS,
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
    focusKeys: BOTTOM_ROW_KEYS,
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
    focusKeys: ALPHABET_KEYS,
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
    focusKeys: ALPHABET_KEYS,
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
    focusKeys: NUMBER_KEYS,
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
    focusKeys: [...ALPHABET_KEYS, ...NUMBER_KEYS, ...SYMBOL_KEYS],
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
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [isPracticing, setIsPracticing] = useState(false);
  const [showPracticeDetails, setShowPracticeDetails] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [activeKey, setActiveKey] = useState('');
  const [placementTargetKey, setPlacementTargetKey] = useState('');
  const [placementLastKey, setPlacementLastKey] = useState('');
  const [placementStatus, setPlacementStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const placementInputRef = useRef<HTMLInputElement>(null);

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
    setShowPracticeDetails(false);
    setTyped('');
    setCurrentLineIndex(0);
    setStartTime(null);
    setErrors(0);
    setActiveKey('');
  };

  const currentLesson = lessons.find(l => l.id === selectedLesson);
  const currentText = currentLesson?.content[currentLineIndex] || '';
  const progressPercentage = Math.round((completedLessons.size / lessons.length) * 100);
  const showFingerPlacement = Boolean(
    currentLesson?.phase === 'Phase 1: Keyboard Mastery' && currentLesson?.focusKeys?.length
  );
  const isPhase1 = currentLesson?.phase === 'Phase 1: Keyboard Mastery';
  const normalizePlacementKey = React.useCallback((key: string) => {
    if (!key) return '';
    if (SHIFT_BASE_MAP[key]) return SHIFT_BASE_MAP[key];
    const lower = key.toLowerCase();
    if (SHIFT_BASE_MAP[lower]) return SHIFT_BASE_MAP[lower];
    if (key.length > 1) return '';
    if (key === ' ') return '';
    return lower;
  }, []);

  const placementKeyPool = React.useMemo(() => {
    if (!currentLesson?.focusKeys?.length || !isPhase1) return [];
    const normalized = currentLesson.focusKeys
      .map((key) => normalizePlacementKey(key))
      .filter((key) => key && key.length === 1);
    return Array.from(new Set(normalized));
  }, [currentLesson, isPhase1, normalizePlacementKey]);

  const pickPlacementTargetKey = React.useCallback(() => {
    if (!placementKeyPool.length) return '';
    const next = placementKeyPool[Math.floor(Math.random() * placementKeyPool.length)];
    return next ?? '';
  }, [placementKeyPool]);

  const placementFingerLabel = React.useMemo(() => {
    if (!placementTargetKey) return '—';
    const finger = KEY_FINGER_MAP[placementTargetKey];
    return finger ? FINGER_LABELS[finger] : '—';
  }, [placementTargetKey]);

  useEffect(() => {
    if (isPhase1 && placementKeyPool.length) {
      setPlacementTargetKey(pickPlacementTargetKey());
      setPlacementStatus('idle');
      setPlacementLastKey('');
      setActiveKey('');
      return;
    }
    setPlacementTargetKey('');
    setPlacementStatus('idle');
    setPlacementLastKey('');
  }, [isPhase1, placementKeyPool, pickPlacementTargetKey]);

  const handleStartPractice = () => {
    setIsPracticing(true);
    setCurrentLineIndex(0);
    setTyped('');
    setStartTime(Date.now());
    setErrors(0);
    setActiveKey('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handlePlacementKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const rawKey = event.key;
    if (!rawKey || rawKey === 'Shift' || rawKey === 'Control' || rawKey === 'Alt' || rawKey === 'Meta') {
      return;
    }
    event.preventDefault();
    const normalized = normalizePlacementKey(rawKey);
    if (!normalized) return;

    setActiveKey(rawKey);
    setPlacementLastKey(rawKey.length === 1 ? rawKey : normalized);

    if (normalized === placementTargetKey) {
      setPlacementStatus('correct');
      const nextKey = pickPlacementTargetKey();
      setTimeout(() => {
        setPlacementTargetKey(nextKey);
        setPlacementStatus('idle');
        setPlacementLastKey('');
      }, 500);
    } else {
      setPlacementStatus('wrong');
    }
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
    setShowPracticeDetails(false);
    setTyped('');
    setCurrentLineIndex(0);
    setActiveKey('');
  };

  const handleClosePractice = () => {
    setIsPracticing(false);
    setShowPracticeDetails(false);
    setTyped('');
    setCurrentLineIndex(0);
    setStartTime(null);
    setErrors(0);
    setActiveKey('');
  };

  const accuracy = typed.length > 0 
    ? Math.round(((typed.length - errors) / typed.length) * 100) 
    : 100;

  const bgClass = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900';
  const sidebarClass = theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200';
  const contentClass = theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200';
  const progressBarBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';

  // Group lessons by phase
  const gettingStarted = lessons.filter(l => l.id === 0);
  const phase1 = lessons.filter(l => l.id >= 1 && l.id <= 8);
  const phase2 = lessons.filter(l => l.id >= 9 && l.id <= 14);
  const phase3 = lessons.filter(l => l.id >= 15);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
      <div className="container mx-auto px-4 py-8">
        {/*-<h1 className="text-4xl font-bold mb-2 text-center">Typing AI Curriculum</h1>
        <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Master touch typing through 18 structured lessons
        </p>*/}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div 
            className={`lg:col-span-1 rounded-lg transition-colors duration-300 ${sidebarClass} max-h-[calc(100vh-10px)] overflow-hidden`}
          >
            <div 
              className="h-full p-6 overflow-y-auto"
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
                  margin-top: 10px;
                  margin-bottom: 10px;
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
                <span className="text-sm font-bold text-sky-600 dark:text-cyan-300">{progressPercentage}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${progressBarBgClass}`}>
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Getting Started */}
            <div className="mb-6">
              <h3 className={`text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-cyan-300' : 'text-sky-600'}`}>
                Introduction
              </h3>
              <div className="space-y-2">
                {gettingStarted.map(lesson => {
                  const isSelected = selectedLesson === lesson.id;
                  const isCompleted = completedLessons.has(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson.id)}
                      className={`w-full text-left p-2 rounded-lg transition-all duration-200 text-sm ${
                        isSelected
                          ? theme === 'dark'
                            ? 'bg-cyan-400 text-slate-900'
                            : 'bg-sky-100 text-sky-900'
                          : theme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    </button>
                  );
                })}
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
                            ? 'bg-cyan-400 text-slate-900'
                            : 'bg-sky-100 text-sky-900'
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
              <h3 className={`text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'}`}>
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
                            ? 'bg-cyan-400 text-slate-900'
                            : 'bg-sky-100 text-sky-900'
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
                            ? 'bg-cyan-400 text-slate-900'
                            : 'bg-sky-100 text-sky-900'
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
          </div>

          {/* Main Content */}
          <div className={`lg:col-span-3 rounded-lg p-8 transition-colors duration-300 ${contentClass}`}>
            {currentLesson && !isPracticing && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold">
                      {currentLesson.id === 0 ? currentLesson.title : `Lesson ${currentLesson.id}: ${currentLesson.title}`}
                    </h2>
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

                {/* Getting Started Content */}
                {currentLesson.id === 0 && (
                  <div className={`mb-5 p-5 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <h3 className="text-xl font-bold mb-3">How to Use This Course:</h3>
                    <div className="space-y-3">
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'}`}>
                        <h4 className={`font-semibold mb-2 text-sky-600 dark:text-cyan-300`}>🎯 Finger Placement</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Study the highlighted keys and learn which finger to use for each key. Practice with the target key checker.
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'}`}>
                        <h4 className={`font-semibold mb-2 text-emerald-500 dark:text-emerald-300`}>📝 Practice Mode</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Type the provided text exercises to master each lesson. Focus on accuracy over speed.
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'}`}>
                        <h4 className={`font-semibold mb-2 text-yellow-500`}>📈 Progress Tracking</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          Complete lessons to track your progress and unlock advanced features. Each lesson builds on the previous one.
                        </p>
                      </div>
                    </div>
                    <div className={`mt-5 p-3 rounded-lg ${theme === 'dark' ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-sky-50 border border-sky-200'}`}>
                      <h4 className={`font-semibold mb-2 text-sky-600 dark:text-cyan-300`}>💡 Pro Tips</h4>
                      <ul className={`text-sm grid grid-cols-2 gap-x-4 gap-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <li>• Focus on accuracy first - speed will come naturally</li>
                        <li>• Keep your fingers on the home row (ASDF JKL;)</li>
                        <li>• Practice regularly for 15-30 minutes daily</li>
                        <li>• Don't look at the keyboard while typing</li>
                        <li>• Take breaks to avoid fatigue and maintain focus</li>
                        <li>• Maintain proper posture while typing</li>
                      </ul>
                    </div>
                  </div>
                )}

                {showFingerPlacement && !showPracticeDetails && (
                  <div className={`mb-6 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">Finger Placement</h3>
                    </div>
                    <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Highlighted keys show the correct finger to use for this lesson.
                    </p>
                    <KeyboardFingerPlacement focusKeys={currentLesson.focusKeys ?? []} activeKey={activeKey} />

                    {isPhase1 && !showPracticeDetails && (
                      <div className={`mt-6 rounded-lg border p-4 ${
                        theme === 'dark' ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <div className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                          }`}>
                            Target Key: <span className="font-mono text-lg">{placementTargetKey.toUpperCase()}</span>
                          </div>
                          <div className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                          }`}>
                            Suggested Finger: <span className="font-semibold">{placementFingerLabel}</span>
                          </div>
                          {placementStatus === 'correct' && (
                            <div className="px-3 py-2 rounded-lg text-sm font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
                              Correct
                            </div>
                          )}
                          {placementStatus === 'wrong' && placementLastKey && (
                            <div className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
                              Wrong: <span className="font-mono">{placementLastKey}</span>
                            </div>
                          )}
                        </div>

                        <input
                          ref={placementInputRef}
                          type="text"
                          value=""
                          readOnly
                          onKeyDown={handlePlacementKeyDown}
                          onKeyUp={() => setActiveKey('')}
                          onBlur={() => setActiveKey('')}
                          placeholder="Click here and press the target key"
                          className={`w-full p-3 rounded-lg border text-sm font-mono transition-colors duration-200 ${
                            theme === 'dark'
                              ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-500'
                              : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                        <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Focus this field and press the target key to check your finger placement.
                        </p>
                      </div>
                    )}
                  </div>
                )}



                {(!isPhase1 || showPracticeDetails) && currentLesson.id > 0 && (
                  <>
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
                  </>
                )}

                {/* Navigation */}
                {/* For Getting Started: Show only Next button */}
                {/* For Phase 1: Show Practice button beside Previous button when in finger placement screen */}
                {/* For Phase 1 with practice details: Show Previous and Next navigation */}
                {/* For other phases: Show normal Previous/Next navigation */}
                <div className="flex gap-4 mt-6">
                  {currentLesson.id === 0 && (
                    <button
                      onClick={() => handleLessonSelect(1)}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }`}
                    >
                      Start Learning →
                    </button>
                  )}
                  
                  {currentLesson.id > 0 && !isPhase1 && (
                    <>
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
                    </>
                  )}
                  
                  {isPhase1 && !showPracticeDetails && (
                    <>
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
                      <button
                        onClick={() => setShowPracticeDetails(true)}
                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-900'
                            : 'bg-sky-600 hover:bg-sky-700 text-white'
                        }`}
                      >
                        Practice
                      </button>
                    </>
                  )}
                  
                  {isPhase1 && showPracticeDetails && (
                    <>
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
                    </>
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
                      className="h-full bg-gradient-to-r from-emerald-400 to-sky-500 transition-all duration-300"
                      style={{ width: `${((currentLineIndex + (typed.length / currentText.length)) / currentLesson.content.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Lesson Objective */}
                <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-sky-50 border border-sky-200'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sky-600 dark:text-cyan-300">🎯</span>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-cyan-200' : 'text-sky-700'}`}>
                      Lesson Goal: {currentLesson.description}
                    </span>
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
                  onKeyDown={(e) => setActiveKey(e.key)}
                  onKeyUp={() => setActiveKey('')}
                  onPaste={(e) => e.preventDefault()}
                  onBlur={() => setActiveKey('')}
                  className={`w-full p-4 rounded-lg border text-lg font-mono transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Type here..."
                  autoFocus
                />

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Errors</div>
                    <div className="text-2xl font-bold text-red-500">{errors}</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Characters</div>
                    <div className="text-2xl font-bold text-sky-600 dark:text-cyan-300">{typed.length}/{currentText.length}</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
                    <div className={`text-2xl font-bold ${accuracy >= 95 ? 'text-green-500' : accuracy >= 80 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {accuracy}%
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Error Rate</div>
                    <div className={`text-2xl font-bold ${errors === 0 ? 'text-green-500' : errors <= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {typed.length > 0 ? ((errors / typed.length) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>


                {/* Practice Navigation */}
                <div className="flex gap-4 mt-6">
                  {selectedLesson > 1 && (
                    <button
                      onClick={() => {
                        handleClosePractice();
                        handleLessonSelect(selectedLesson - 1);
                      }}
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
                      onClick={() => {
                        handleClosePractice();
                        handleLessonSelect(selectedLesson + 1);
                      }}
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
          </div>
        </div>
      </div>
    </div>
  );
}
