import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { selectTime, setScriptMode, setCustomScript, selectDefaultScript, startPractice, endPractice, tick, reset } from '../practiceSlice';
import { loadText as loadTextAction, finishTest, reset as resetTypingAction } from '../../typing/typingSlice';
import { useTyping } from '../../typing/hooks/useTyping';
import TextDisplay from '../../typing/components/TextDisplay';
import StatsPanel from '../../typing/components/StatsPanel';
import ResultsPage from './ResultsPage';
import { useTheme } from '../../../providers/ThemeProvider';
import { generatePracticeText, clear } from '../../ai/aiPracticeSlice';

const TIMER_OPTIONS = [
  { label: '1 min', value: 60000, length: 'short' as const },
  { label: '2 min', value: 120000, length: 'medium' as const },
  { label: '5 min', value: 300000, length: 'long' as const },
  { label: '10 min', value: 600000, length: 'long' as const },
];

// Scripts organized by timer and topic - each with appropriate length for the timer
const SCRIPT_LIBRARY = {
  60000: { // 1 min - short scripts (~40-60 words)
    length: 'short' as const,
    topics: [
      "JavaScript enables developers to create interactive web applications with real-time updates. It powers animations, form validation, and dynamic content changes. Modern JavaScript frameworks simplify building complex user interfaces efficiently.",
      "Python is widely used for data science, machine learning, and web development. Its clean syntax makes code readable and easy to maintain. Popular libraries like NumPy and Pandas facilitate data analysis.",
      "Cloud computing provides scalable infrastructure for businesses. Services like AWS, Google Cloud, and Azure handle storage and processing. Organizations benefit from reduced infrastructure costs and improved reliability.",
    ]
  },
  120000: { // 2 min - medium scripts (~80-120 words)
    length: 'medium' as const,
    topics: [
      "Web development has evolved dramatically with modern frameworks and tools. React, Vue, and Angular enable developers to build sophisticated single-page applications efficiently. These frameworks emphasize reusable components and state management. Development teams use TypeScript for type safety and better code quality. Testing frameworks ensure application reliability and maintainability. Developers collaborate using Git and continuous integration pipelines.",
      "Machine learning transforms industries by enabling computers to learn from data. Supervised learning trains models with labeled examples to make predictions. Unsupervised learning discovers patterns in unlabeled data. Deep learning uses neural networks for complex pattern recognition. Companies apply these techniques to recommendation systems, fraud detection, and autonomous vehicles. Ethical considerations guide responsible AI development.",
      "Database systems store and retrieve data for applications. Relational databases use structured schemas and SQL queries. NoSQL databases provide flexibility for unstructured data. Each database type has advantages depending on use cases. Indexes improve query performance significantly. Backup and disaster recovery ensure data safety.",
    ]
  },
  300000: { // 5 min - long scripts (~200-250 words)
    length: 'long' as const,
    topics: [
      "The internet has fundamentally transformed modern society in unprecedented ways. Communication that once took days now occurs instantly across continents. Social media connects billions of people, enabling ideas to spread globally. E-commerce has revolutionized retail, allowing consumers to shop from anywhere. Remote work proves that productivity doesn't require physical offices. Streaming services provide on-demand entertainment to millions. Video conferencing enables face-to-face meetings regardless of location. Online education makes learning accessible worldwide. The internet continues evolving with emerging technologies like artificial intelligence, blockchain, quantum computing, and augmented reality. These innovations promise further transformations in how we work, learn, and connect.",
      "Software development practices have evolved significantly over recent decades. Agile methodologies replaced waterfall approaches, enabling faster iteration. Teams work in sprints, delivering features incrementally. Continuous integration automates testing and reduces deployment risks. DevOps culture bridges development and operations teams. Cloud infrastructure eliminates physical server management needs. Containerization with Docker ensures consistent environments. Kubernetes orchestrates containers at scale. Open source communities democratize software development globally. Version control systems like Git enable seamless collaboration. Testing automation ensures code quality throughout development. Monitoring tools provide insights into application performance.",
      "User experience design shapes how people interact with technology. Research methodologies help understand user needs and behaviors. Prototyping and usability testing validate design decisions early. Accessibility ensures applications work for people with various abilities. Mobile-first design acknowledges smartphone prevalence. Responsive layouts adapt to different screen sizes. Dark mode reduces eye strain during extended usage. Performance optimization ensures fast loading and instant responses. Accessibility considerations include color contrast, keyboard navigation, and screen reader compatibility. User feedback drives continuous improvement cycles.",
    ]
  },
  600000: { // 10 min - long scripts (~400-500 words)
    length: 'long' as const,
    topics: [
      "The Fourth Industrial Revolution, often called Industry 4.0, represents a fundamental shift in how we produce, consume, and think about goods and services. This transformation integrates digital, physical, and biological systems in unprecedented ways. Internet of Things devices collect and transmit vast amounts of data, providing insights previously impossible to obtain. Artificial intelligence analyzes this data to identify patterns and make predictions with remarkable accuracy. Machine learning algorithms improve through exposure to more data. Blockchain technology enables secure, decentralized transactions without intermediaries. Quantum computing promises to solve problems currently considered computationally impossible. Nanotechnology enables manipulation at molecular levels. These technologies converge to create smart cities, autonomous vehicles, personalized medicine, and sustainable solutions. Smart cities use IoT sensors to optimize traffic, energy, and utilities. Autonomous vehicles promise safer roads and transformed transportation. Personalized medicine tailors treatments to individual genetic profiles. The pace of technological change accelerates, requiring continuous learning from professionals. Education systems must adapt to prepare students for technology-driven careers. Organizations must stay current with emerging technologies to remain competitive.",
      "Cybersecurity has become paramount as our dependence on digital systems grows exponentially. Data breaches expose millions of records, compromising privacy and causing financial losses. Ransomware attacks target critical infrastructure, affecting entire communities and economies. Artificial intelligence helps detect anomalies and respond to threats faster than humans ever could. However, cybercriminals use AI to launch more sophisticated attacks. Zero-trust security models assume no user or device is inherently trustworthy. Multi-factor authentication provides additional layers of protection against unauthorized access. Regular security audits and penetration testing identify vulnerabilities before attackers exploit them. Encryption protects data both in transit and at rest. Threat intelligence sharing helps organizations stay informed about emerging threats. Employee training reduces human error, often the weakest link in security. Organizations must balance strong security with usability, avoiding friction that frustrates users. Regulatory compliance requirements like GDPR shape security practices. Insurance and risk management strategies help organizations prepare for potential breaches.",
      "The global economy increasingly depends on digital infrastructure and digital skills for competitiveness. Countries compete to develop artificial intelligence capabilities and secure rare earth materials. Supply chains have become vulnerable to disruptions, as recent events demonstrated. Companies invest in resilience and diversification to reduce dependencies. Remote work enables hiring talent globally while providing employee flexibility. Digital currencies and blockchain challenge traditional banking systems fundamentally. Cryptocurrency adoption raises important questions about regulation and environmental impact. Financial technology disrupts traditional banking and insurance industries. The digital divide between developed and developing nations risks creating inequality. Education systems worldwide must adapt to teach digital literacy comprehensively. Emerging technologies create new job categories while eliminating others. Workforce adaptation and reskilling become essential ongoing processes. Economic policies must address technological unemployment and wealth inequality. Social safety nets may require redesign for technology-driven economies.",
    ]
  },
};

export default function PracticeMode() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const practice = useSelector((s: RootState) => s.practice);
  const aiText = useSelector((s: RootState) => s.aiPractice.text);
  const { typed, text, stats, handleChange, handleReset: resetTyping } = useTyping();
  
  const [showGenerateUI, setShowGenerateUI] = useState(false);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load default script when selected
  useEffect(() => {
    if (practice.scriptSelected && practice.scriptMode === 'default' && practice.selectedTime) {
      const scripts = SCRIPT_LIBRARY[practice.selectedTime as keyof typeof SCRIPT_LIBRARY];
      if (scripts) {
        const randomScript = scripts.topics[Math.floor(Math.random() * scripts.topics.length)];
        dispatch(loadTextAction(randomScript));
      }
    }
  }, [practice.scriptSelected, practice.scriptMode, practice.selectedTime, dispatch]);

  // Load generated script only when user has opened the generate UI
  useEffect(() => {
    if (aiText && practice.scriptMode === 'generate' && showGenerateUI) {
      dispatch(loadTextAction(aiText));
      dispatch(selectDefaultScript()); // Mark script as selected
      // hide generate UI after selecting the script
      setShowGenerateUI(false);
    }
  }, [aiText, practice.scriptMode, showGenerateUI, dispatch]);

  // Handle timer countdown
  useEffect(() => {
    if (practice.started && practice.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        dispatch(tick());
      }, 250);
    } else if (practice.timeRemaining <= 0 && practice.started) {
      if (timerRef.current) clearInterval(timerRef.current);
      dispatch(finishTest());
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [practice.started, practice.timeRemaining, dispatch]);

  // If typing finishes early, force the practice session to end so results show immediately
  const typingStatus = useSelector((s: RootState) => s.typing.status);
  useEffect(() => {
    if (typingStatus === 'finished' && practice.started && practice.timeRemaining > 0) {
      // set timeRemaining to 0 which will trigger the results view and clear interval above
      dispatch(endPractice());
    }
  }, [typingStatus, practice.started, practice.timeRemaining, dispatch]);

  const handleSelectTime = (timeMs: number) => {
    dispatch(selectTime(timeMs));
    setShowGenerateUI(false);
  };

  const handleSelectDefaultScript = () => {
    dispatch(setScriptMode('default'));
    dispatch(selectDefaultScript());
  };

  const handleSelectGenerateScript = () => {
    // clear any previously generated global AI text so the user starts fresh
    dispatch(clear());
    dispatch(setScriptMode('generate'));
    setShowGenerateUI(true);
  };

  const handleGenerateScript = async () => {
    if (!topic.trim()) {
      setError('Give an input to generate the script');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    const scriptConfig = SCRIPT_LIBRARY[practice.selectedTime as keyof typeof SCRIPT_LIBRARY];
    const length = scriptConfig?.length || 'long';
    await dispatch(generatePracticeText({ topic, length }) as any);
  };

  const handleStartPractice = () => {
    if (!text) {
      alert('Please select a script first');
      return;
    }
    if (!practice.selectedTime) {
      alert('Please select a timer duration');
      return;
    }
    dispatch(startPractice());
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResetPractice = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    dispatch(reset());
    dispatch(resetTypingAction());
    setTopic('');
    setShowGenerateUI(false);
    setError('');
    // clear any generated AI text when leaving practice
    dispatch(clear());
  };

  // Step 1: Timer Selection (Always shown first)
  if (!practice.selectedTime) {
    return (
      <div className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800/40 backdrop-blur-md'
          : 'bg-white border border-gray-300'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Practice Mode
        </h2>

        <div className="mb-6">
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
            Select Timer Duration
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TIMER_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => handleSelectTime(option.value)}
                className={`p-4 rounded-lg border-2 transition-colors duration-200 text-2xl font-bold ${
                  practice.selectedTime === option.value
                    ? theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-indigo-600 bg-indigo-100 text-indigo-700'
                    : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 hover:border-gray-500 text-gray-300'
                    : 'border-gray-300 bg-gray-100 hover:border-gray-400 text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Script Selection
  if (!practice.scriptSelected) {
    return (
      <div className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800/40 backdrop-blur-md'
          : 'bg-white border border-gray-300'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Select Script
        </h2>

        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSelectDefaultScript}
            className={`flex-1 px-4 py-3 rounded-md font-semibold transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            Default Script
          </button>
          <button
            onClick={handleSelectGenerateScript}
            className={`flex-1 px-4 py-3 rounded-md font-semibold transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            Generate Script
          </button>
        </div>

        {showGenerateUI && (
          <div className="mb-6 p-4 rounded-lg border" style={{
            borderColor: theme === 'dark' ? '#4B5563' : '#d1d5db',
            backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
          }}>
            <div className="mb-4">
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Enter topic for script generation..."
                className={`w-full p-3 rounded-md border transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={!topic.trim()}
              className={`w-full px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                !topic.trim()
                  ? theme === 'dark'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                  : theme === 'dark'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              Generate
            </button>

            {error && (
              <div className={`p-3 rounded-md text-sm font-medium mt-3 ${
                theme === 'dark'
                  ? 'bg-red-900/30 border border-red-700 text-red-300'
                  : 'bg-red-100 border border-red-400 text-red-800'
              }`}>
                {error}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleResetPractice}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
            }`}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Preview & Start (if practice hasn't started)
  if (!practice.started) {
    return (
      <div className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800/40 backdrop-blur-md'
          : 'bg-white border border-gray-300'
      }`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Ready to Practice?
        </h2>

        <div className={`mb-4 p-2 rounded text-sm ${
          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
        }`}>
          Duration: <span className="font-semibold">{formatTime(practice.selectedTime!)}</span> | 
          Mode: <span className="font-semibold">{practice.scriptMode === 'default' ? 'Default Script' : 'Generated Script'}</span>
        </div>

        <div className={`rounded-md overflow-hidden border p-4 h-48 mb-6 transition-colors duration-300 ${
          theme === 'dark'
            ? 'border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800'
            : 'border-gray-300 bg-gray-50'
        }`}>
          <TextDisplay text={text} typed="" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleResetPractice}
            className={`px-4 py-3 rounded-md transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
            }`}
          >
            Back
          </button>
          <button
            onClick={handleStartPractice}
            className={`flex-1 px-6 py-3 rounded-md font-semibold transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Start Practice
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Practice Active or Results
  if (practice.timeRemaining <= 0 && practice.started) {
    return (
      <ResultsPage
        wpm={stats.wpm}
        cpm={stats.cpm}
        accuracy={stats.accuracy}
        errors={stats.errors}
        duration={practice.selectedTime! - practice.timeRemaining}
        text={text}
        typed={typed}
        onClose={handleResetPractice}
      />
    );
  }

  // Step 4: Practice Active
  return (
    <div className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/40 backdrop-blur-md'
        : 'bg-white border border-gray-300'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Practice in Progress
        </h2>
        <div className={`text-4xl font-bold ${
          practice.timeRemaining > 0
            ? theme === 'dark'
              ? 'text-indigo-400'
              : 'text-indigo-600'
            : theme === 'dark'
            ? 'text-red-400'
            : 'text-red-600'
        }`}>
          {formatTime(practice.timeRemaining)}
        </div>
      </div>

      <div className={`h-2 rounded-full mb-6 overflow-hidden ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
      }`}>
        <div
          className="h-full bg-indigo-600 transition-all duration-250"
          style={{ width: `${(practice.timeRemaining / practice.selectedTime!) * 100}%` }}
        />
      </div>

      <div className={`rounded-md overflow-hidden border p-4 h-48 mb-4 transition-colors duration-300 ${
        theme === 'dark'
          ? 'border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800'
          : 'border-gray-300 bg-gray-50'
      }`}>
        <TextDisplay text={text} typed={typed} />
      </div>

      <input
        ref={inputRef}
        value={typed}
        onChange={e => handleChange(e.target.value)}
        onPaste={e => e.preventDefault()}
        onCopy={e => e.preventDefault()}
        disabled={practice.timeRemaining <= 0}
        className={`w-full p-3 rounded-md border transition-colors duration-200 mb-4 ${
          practice.timeRemaining <= 0
            ? theme === 'dark'
              ? 'border-gray-600 bg-gray-700 text-gray-400 placeholder-gray-500 cursor-not-allowed'
              : 'border-gray-300 bg-gray-100 text-gray-500 placeholder-gray-400 cursor-not-allowed'
            : theme === 'dark'
            ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
        }`}
        placeholder="Start typing..."
        autoFocus
      />

      <StatsPanel
        wpm={stats.wpm}
        cpm={stats.cpm}
        accuracy={stats.accuracy}
        errors={stats.errors}
        elapsed={stats.elapsed}
      />

      <button
        onClick={handleResetPractice}
        className={`w-full px-6 py-3 rounded-md font-semibold transition-colors duration-200 mt-4 ${
          theme === 'dark'
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
        }`}
      >
        Exit Practice
      </button>
    </div>
  );
}
