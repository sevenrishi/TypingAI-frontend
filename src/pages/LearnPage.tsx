import React, { useState, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { CheckCircle, Book, Hand, Keyboard, Trophy, Zap } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  content: {
    sections: Array<{
      heading: string;
      points: string[];
    }>;
  };
}

const modules: Module[] = [
  {
    id: 'basics',
    title: 'Typing Basics',
    description: 'Learn the fundamentals of touch typing',
    icon: <Book className="w-6 h-6" />,
    completed: false,
    content: {
      sections: [
        {
          heading: 'Introduction to Touch Typing',
          points: [
            'Touch typing is typing without looking at the keyboard',
            'It relies on muscle memory and proper finger placement',
            'Benefits include increased speed, accuracy, and reduced strain'
          ]
        },
        {
          heading: 'QWERTY Layout',
          points: [
            'The QWERTY layout is the standard keyboard arrangement',
            'Designed to minimize typebar jams on mechanical typewriters',
            'Now the most widely used keyboard layout worldwide'
          ]
        },
        {
          heading: 'Typing Goals',
          points: [
            'Average typing speed: 40-60 WPM',
            'Professional typing speed: 60-80 WPM',
            'Advanced typing speed: 80+ WPM',
            'Aim for accuracy above 95% in all practice sessions'
          ]
        }
      ]
    }
  },
  {
    id: 'hand-position',
    title: 'Hand Position',
    description: 'Master the home row and finger placement',
    icon: <Hand className="w-6 h-6" />,
    completed: false,
    content: {
      sections: [
        {
          heading: 'The Home Row',
          points: [
            'Left hand: A S D F (index through pinky)',
            'Right hand: J K L ; (index through pinky)',
            'Position your hands on the home row as your starting point',
            'You should return to the home row after each keystroke'
          ]
        },
        {
          heading: 'Finger Assignment',
          points: [
            'Left pinky: A, Q, Z and all keys to the left',
            'Left ring: S, W, X',
            'Left middle: D, E, C',
            'Left index: F, G, B, V, H (reaching)',
            'Right index: J, H, Y, U, N, M (reaching)',
            'Right middle: K, I, comma',
            'Right ring: L, O, period',
            'Right pinky: semicolon, P, slash, and all keys to the right'
          ]
        },
        {
          heading: 'Posture Tips',
          points: [
            'Keep your back straight and shoulders relaxed',
            'Elbows should be at a 90-degree angle',
            'Keep wrists straight, not bent up or down',
            'Keep hands curved as if holding a small ball',
            'Feet should be flat on the ground for stability',
            'Monitor should be at eye level, about 20-26 inches away'
          ]
        }
      ]
    }
  },
  {
    id: 'practice',
    title: 'Practice Exercises',
    description: 'Develop speed and consistency through drills',
    icon: <Keyboard className="w-6 h-6" />,
    completed: false,
    content: {
      sections: [
        {
          heading: 'Beginner Exercises',
          points: [
            'Start with single-row exercises using home row keys',
            'Practice each finger individually to build muscle memory',
            'Use typing software that provides immediate feedback',
            'Focus on accuracy before speed - speed comes naturally'
          ]
        },
        {
          heading: 'Intermediate Exercises',
          points: [
            'Combine multiple rows and increase typing speed',
            'Practice common letter combinations and words',
            'Work on reaching keys with your index fingers',
            'Gradually increase difficulty level as you improve'
          ]
        },
        {
          heading: 'Daily Practice Strategy',
          points: [
            'Practice 30-60 minutes daily for best results',
            'Start each session with warm-up exercises',
            'Focus on one skill at a time',
            'Review challenging patterns regularly',
            'Track your progress weekly'
          ]
        },
        {
          heading: 'Common Mistakes to Avoid',
          points: [
            'Looking down at the keyboard - keep eyes on screen',
            'Using incorrect fingers for keys - stick to finger assignment',
            'Rushing before accuracy is achieved - accuracy first',
            'Poor posture - maintain proper alignment',
            'Inconsistent practice - daily practice is key'
          ]
        }
      ]
    }
  },
  {
    id: 'tests',
    title: 'Typing Tests',
    description: 'Measure your progress and identify weak areas',
    icon: <Trophy className="w-6 h-6" />,
    completed: false,
    content: {
      sections: [
        {
          heading: 'Understanding Test Modes',
          points: [
            'Timed tests: Race against the clock for speed measurement',
            'Accuracy tests: Focus on precision with a passage',
            'Sprint tests: Short 30-60 second bursts for intensity',
            'Marathon tests: Longer sessions to build endurance'
          ]
        },
        {
          heading: 'Interpreting Your Results',
          points: [
            'WPM (Words Per Minute): Total words typed divided by minutes',
            'Accuracy: Percentage of correct characters typed',
            'CPM (Characters Per Minute): Total characters typed per minute',
            'Error Rate: Percentage of mistakes made during test'
          ]
        },
        {
          heading: 'Test Tips',
          points: [
            'Read ahead slightly to anticipate upcoming words',
            'Maintain steady pace rather than bursting',
            'Don\'t slow down to correct errors mid-test',
            'Take breaks between tests to avoid fatigue',
            'Review error patterns to identify problem areas'
          ]
        }
      ]
    }
  },
  {
    id: 'pro-tips',
    title: 'Pro Level Tips',
    description: 'Advanced techniques for elite typing speed',
    icon: <Zap className="w-6 h-6" />,
    completed: false,
    content: {
      sections: [
        {
          heading: 'Speed Optimization',
          points: [
            'Develop key combinations that require minimal finger movement',
            'Use keyboard shortcuts to reduce reaching distances',
            'Practice common word patterns for fluid typing',
            'Build rhythm and maintain consistent keystroke timing'
          ]
        },
        {
          heading: 'Advanced Techniques',
          points: [
            'Anticipation typing: Predict upcoming words and type slightly ahead',
            'Chord combinations: Press multiple keys simultaneously when beneficial',
            'Momentum maintenance: Keep fingers moving even during pauses',
            'Microadjustments: Subtle position changes for different key clusters'
          ]
        },
        {
          heading: 'Accuracy Maintenance at High Speed',
          points: [
            'Never sacrifice accuracy for speed',
            'Maintain conscious awareness of finger positions',
            'Use progressive difficulty to build speed safely',
            'Regular accuracy drills to prevent bad habits',
            'Audio feedback can help catch errors in real-time'
          ]
        },
        {
          heading: 'Continuous Improvement',
          points: [
            'Set specific achievable goals (e.g., 10 WPM improvement per month)',
            'Analyze test data to identify persistent weak areas',
            'Participate in typing competitions for motivation',
            'Learn alternative keyboard layouts (Dvorak, Colemak) for specialized benefits',
            'Stay consistent - elite typists practice daily'
          ]
        }
      ]
    }
  }
];

export default function LearnPage() {
  const { theme } = useTheme();
  const [selectedModule, setSelectedModule] = useState<string>('basics');
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  // Load completed modules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedTypingModules');
    if (saved) {
      setCompletedModules(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleCompleteModule = () => {
    const updated = new Set(completedModules);
    updated.add(selectedModule);
    setCompletedModules(updated);
    localStorage.setItem('completedTypingModules', JSON.stringify([...updated]));
  };

  const currentModule = modules.find(m => m.id === selectedModule);
  const progressPercentage = Math.round((completedModules.size / modules.length) * 100);

  const bgClass = theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900';
  const sidebarClass = theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200';
  const contentClass = theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200';
  const progressBarBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200';
  const buttonHoverClass = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const selectedButtonClass = theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900';
  const nextButtonClass = theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-900';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Typing Mastery Journey</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className={`lg:col-span-1 rounded-lg p-6 transition-colors duration-300 ${sidebarClass}`}>
            <h2 className="text-xl font-bold mb-4">Course Progress</h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-bold text-blue-500">{progressPercentage}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${progressBarBgClass}`}>
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Module List */}
            <div className="space-y-3">
              {modules.map(module => {
                const isSelected = selectedModule === module.id;
                const moduleButtonClass = isSelected ? selectedButtonClass : buttonHoverClass;
                const iconColorClass = isSelected ? 'text-white' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-600');
                const descColorClass = isSelected ? 'opacity-90' : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500');
                
                return (
                  <button
                    key={module.id}
                    onClick={() => setSelectedModule(module.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${moduleButtonClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <div className={iconColorClass}>
                          {module.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">{module.title}</div>
                          <div className={`text-xs line-clamp-1 ${descColorClass}`}>
                            {module.description}
                          </div>
                        </div>
                      </div>
                      {completedModules.has(module.id) && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className={`lg:col-span-3 rounded-lg p-8 transition-colors duration-300 ${contentClass}`}>
            {currentModule && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl text-blue-500">{currentModule.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold">{currentModule.title}</h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentModule.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-8 mb-8">
                  {currentModule.content.sections.map((section, idx) => (
                    <div key={idx}>
                      <h3 className="text-xl font-bold mb-3 text-blue-500">{section.heading}</h3>
                      <ul className="space-y-2">
                        {section.points.map((point, pidx) => (
                          <li key={pidx} className="flex gap-3">
                            <span className="text-blue-500 font-bold flex-shrink-0 mt-1">•</span>
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t" style={{
                  borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
                }}>
                  {!completedModules.has(selectedModule) && (
                    <button
                      onClick={handleCompleteModule}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      ✓ Mark as Complete
                    </button>
                  )}
                  {completedModules.has(selectedModule) && (
                    <div className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Completed
                    </div>
                  )}
                  
                  {selectedModule !== 'pro-tips' && (
                    <button
                      onClick={() => {
                        const nextIdx = modules.findIndex(m => m.id === selectedModule) + 1;
                        if (nextIdx < modules.length) {
                          setSelectedModule(modules[nextIdx].id);
                        }
                      }}
                      className={`flex-1 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${nextButtonClass}`}
                    >
                      Next Module →
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
