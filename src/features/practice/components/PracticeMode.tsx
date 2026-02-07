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
import { useSaveSession } from '../../../hooks/useSaveSession';

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
  const { saveSession } = useSaveSession();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const practice = useSelector((s: RootState) => s.practice);
  const aiText = useSelector((s: RootState) => s.aiPractice.text);
  const { typed, text, stats, handleChange } = useTyping();

  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100'
    : 'bg-white/60 border-slate-200/80 text-slate-900';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const inputBase = isDark
    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500';
  const primaryButton = isDark
    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900 shadow-[0_18px_40px_rgba(34,211,238,0.35)] hover:shadow-[0_22px_48px_rgba(34,211,238,0.45)]'
    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] hover:shadow-[0_22px_48px_rgba(14,165,233,0.35)]';
  const secondaryButton = isDark
    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700';
  const ghostButton = isDark
    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
    : 'bg-slate-200 hover:bg-slate-300 text-slate-700';
  const disabledButton = isDark
    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
    : 'bg-slate-200 text-slate-500 cursor-not-allowed';
  const timerSelected = isDark
    ? 'border-cyan-400/70 bg-cyan-500/15 text-cyan-200'
    : 'border-sky-300 bg-sky-100 text-sky-700';
  const timerDefault = isDark
    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500'
    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';
  
  const [showGenerateUI, setShowGenerateUI] = useState(false);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedRef = useRef(false);

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

  useEffect(() => {
    if (!practice.started || practice.timeRemaining > 0 || savedRef.current || !text) return;
    savedRef.current = true;

    const durationFromTimer = practice.selectedTime ? (practice.selectedTime - practice.timeRemaining) : stats.elapsed;
    const duration = stats.elapsed > 0 ? stats.elapsed : durationFromTimer;

    saveSession({
      type: 'practice',
      wpm: stats.wpm,
      cpm: stats.cpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      duration,
      text,
      mode: practice.scriptMode
    });
  }, [practice.started, practice.timeRemaining, practice.selectedTime, text, stats.wpm, stats.cpm, stats.accuracy, stats.errors, stats.elapsed, practice.scriptMode, saveSession]);

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
    savedRef.current = false;
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
      <section className={`rounded-[28px] border p-6 md:p-8 shadow-lg transition-colors duration-300 ${surface}`}>
        <div className="space-y-2">
          <div
            className={`text-[11px] uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Practice Mode
          </div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
            Choose your session length
          </h2>
          <p className={mutedText}>Pick a timer and let the AI build a focused drill around it.</p>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
            Select Timer
          </h3>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {TIMER_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => handleSelectTime(option.value)}
                className={`p-4 rounded-2xl border transition-colors duration-200 text-lg font-semibold ${
                  practice.selectedTime === option.value ? timerSelected : timerDefault
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Step 2: Script Selection
  if (!practice.scriptSelected) {
    return (
      <section className={`rounded-[28px] border p-6 md:p-8 shadow-lg transition-colors duration-300 ${surface}`}>
        <div className="space-y-2">
          <div
            className={`text-[11px] uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Script Selection
          </div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
            Pick your drill script
          </h2>
          <p className={mutedText}>Choose a curated prompt or generate a fresh one with AI.</p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleSelectDefaultScript}
            className={`px-4 py-4 rounded-2xl font-semibold transition-colors duration-200 border ${secondaryButton}`}
          >
            Use curated script
          </button>
          <button
            onClick={handleSelectGenerateScript}
            className={`px-4 py-4 rounded-2xl font-semibold transition-colors duration-200 ${primaryButton}`}
          >
            Generate with AI
          </button>
        </div>

        {showGenerateUI && (
          <div className={`mt-6 p-4 rounded-2xl border ${surfaceSoft}`}>
            <div className="mb-4">
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Enter topic for script generation..."
                className={`w-full p-3 rounded-xl border transition-colors duration-200 ${inputBase}`}
              />
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={!topic.trim()}
              className={`w-full px-4 py-3 rounded-xl font-semibold transition-colors duration-200 ${
                !topic.trim() ? disabledButton : primaryButton
              }`}
            >
              Generate script
            </button>

            {error && (
              <div className={`mt-3 p-3 rounded-xl text-sm font-medium border ${
                isDark
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                  : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}>
                {error}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleResetPractice}
            className={`px-4 py-2 rounded-xl transition-colors duration-200 ${ghostButton}`}
          >
            Back
          </button>
        </div>
      </section>
    );
  }

  // Step 3: Preview & Start (if practice hasn't started)
  if (!practice.started) {
    return (
      <section className={`rounded-[28px] border p-6 md:p-8 shadow-lg transition-colors duration-300 ${surface}`}>
        <div className="space-y-2">
          <div
            className={`text-[11px] uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Practice Preview
          </div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
            Ready to practice?
          </h2>
          <p className={mutedText}>Confirm the session settings and begin when you’re ready.</p>
        </div>

        <div className={`mt-6 flex flex-wrap gap-3 rounded-2xl border px-4 py-3 text-sm ${surfaceSoft}`}>
          <span>
            Duration: <span className="font-semibold">{formatTime(practice.selectedTime!)}</span>
          </span>
          <span className="text-slate-400">•</span>
          <span>
            Mode: <span className="font-semibold">{practice.scriptMode === 'default' ? 'Curated Script' : 'AI Script'}</span>
          </span>
        </div>

        <div className={`mt-6 rounded-2xl overflow-hidden border p-4 h-52 ${surfaceSoft}`}>
          <TextDisplay text={text} typed="" />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleResetPractice}
            className={`px-4 py-3 rounded-xl transition-colors duration-200 ${ghostButton}`}
          >
            Back
          </button>
          <button
            onClick={handleStartPractice}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 ${primaryButton}`}
          >
            Start Practice
          </button>
        </div>
      </section>
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
    <section className={`rounded-[28px] border p-6 md:p-8 shadow-lg transition-colors duration-300 ${surface}`}>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div>
          <div
            className={`text-[11px] uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Live Practice
          </div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
            Practice in progress
          </h2>
        </div>
        <div className={`text-4xl font-bold ${practice.timeRemaining > 0 ? 'text-cyan-300' : 'text-rose-400'}`}>
          {formatTime(practice.timeRemaining)}
        </div>
      </div>

      <div className={`h-2 rounded-full mb-6 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-250"
          style={{ width: `${(practice.timeRemaining / practice.selectedTime!) * 100}%` }}
        />
      </div>

      <div className={`rounded-2xl overflow-hidden border p-4 h-52 mb-4 ${surfaceSoft}`}>
        <TextDisplay text={text} typed={typed} />
      </div>

      <input
        ref={inputRef}
        value={typed}
        onChange={e => handleChange(e.target.value)}
        onPaste={e => e.preventDefault()}
        onCopy={e => e.preventDefault()}
        disabled={practice.timeRemaining <= 0}
        className={`w-full p-3 rounded-xl border transition-colors duration-200 mb-4 ${
          practice.timeRemaining <= 0 ? `${inputBase} opacity-60 cursor-not-allowed` : inputBase
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
        className={`w-full px-6 py-3 rounded-xl font-semibold transition-colors duration-200 mt-5 ${ghostButton}`}
      >
        Exit Practice
      </button>
    </section>
  );
}
