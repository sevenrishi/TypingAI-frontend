import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { generateTestText } from '../../ai/aiTestSlice';
import TextDisplay from './TextDisplay';
import StatsPanel from './StatsPanel';
import { useTyping } from '../hooks/useTyping';
import { loadText as loadTextAction, reset as resetTypingAction } from '../typingSlice';
import { useTheme } from '../../../providers/ThemeProvider';
import ResultsPage from '../../practice/components/ResultsPage';
import { useSaveSession } from '../../../hooks/useSaveSession';
import api from '../../../api/axios';

export default function TypingTest() {
  const dispatch = useAppDispatch();
  const { saveSession } = useSaveSession();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const aiText = useSelector((s: RootState) => s.aiTest.text);
  const { typed, text, status, stats, handleChange, raceLocked, countdown } = useTyping();

  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'short'|'medium'|'long'>('short');
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const savedRef = useRef(false);

  // when AI text changes, load into typing slice
  React.useEffect(() => {
    if (aiText) {
      savedRef.current = false;
      dispatch(loadTextAction(aiText));
      setStartTime(Date.now());
      setTestStarted(false);
    }
  }, [aiText, dispatch]);

  React.useEffect(() => {
    if (status !== 'finished' || !text || savedRef.current) return;
    savedRef.current = true;

    const duration = stats.elapsed || 0;
    const payload = {
      type: 'test' as const,
      wpm: stats.wpm,
      cpm: stats.cpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      duration,
      text
    };

    saveSession(payload);

    api.post('/results', {
      wpm: stats.wpm,
      cpm: stats.cpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      duration,
      text
    }).catch((err) => {
      console.error('Failed to save test result:', err);
    });
  }, [status, text, stats.wpm, stats.cpm, stats.accuracy, stats.errors, stats.elapsed, saveSession]);

  const handleStart = async () => {
    if (!topic.trim()) {
      setError('Give an input to generate the script');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    await dispatch(generateTestText({ topic, length }));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleTestReset = () => {
    savedRef.current = false;
    setTopic('');
    setStartTime(0);
    setTestStarted(false);
    dispatch(resetTypingAction());
  };

  const handleStartTest = () => {
    if (!text) {
      setError('Generate a script before starting');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    setTestStarted(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // If test is finished, show results page
  if (status === 'finished' && text.length > 0) {
    const duration = stats.elapsed || (Date.now() - startTime);
    return (
      <ResultsPage
        wpm={stats.wpm}
        cpm={stats.cpm}
        accuracy={stats.accuracy}
        errors={stats.errors}
        duration={duration}
        text={text}
        typed={typed}
        onClose={handleTestReset}
      />
    );
  }

  const showGenerateUI = !testStarted;
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
  const disabledButton = isDark
    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
    : 'bg-slate-200 text-slate-500 cursor-not-allowed';

  return (
    <section className={`rounded-[28px] border p-6 md:p-8 shadow-lg transition-colors duration-300 ${surface}`}>
      <div className="flex flex-col gap-6">
        <header className="space-y-2">
          <div
            className={`text-[11px] uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Typing Test
          </div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
            AI-generated test run
          </h2>
          <p className={mutedText}>
            Generate a custom script, then lock in focus for a single high-precision sprint.
          </p>
        </header>

        {showGenerateUI && (
          <div className={`rounded-2xl border p-4 ${surfaceSoft}`}>
            <div className="flex flex-wrap gap-3 items-center">
              <input
                className={`flex-1 min-w-[160px] p-3 rounded-xl border transition-colors duration-200 ${inputBase}`}
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Enter a topic to generate your typing script using AI"
              />
              <select
                value={length}
                onChange={e => setLength(e.target.value as any)}
                className={`p-3 rounded-xl border transition-colors duration-200 ${inputBase}`}
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
              <button
                onClick={handleStart}
                disabled={!topic.trim()}
                className={`px-4 py-3 rounded-xl font-semibold transition-colors duration-200 ${
                  !topic.trim() ? disabledButton : primaryButton
                }`}
              >
                Generate
              </button>
            </div>

            {error && (
              <div className={`mt-4 p-3 rounded-xl text-sm font-medium border ${
                isDark
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                  : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}>
                {error}
              </div>
            )}
          </div>
        )}

        <div className={`rounded-2xl overflow-hidden border p-4 h-52 ${surfaceSoft}`}>
          <TextDisplay text={text} typed={typed} />
        </div>

        {showGenerateUI && (
          <button
            onClick={handleStartTest}
            disabled={!text}
            className={`w-full py-3 rounded-xl font-semibold transition-colors duration-200 ${
              !text ? disabledButton : primaryButton
            }`}
          >
            Start Test
          </button>
        )}

        {!showGenerateUI && (
          <>
            {raceLocked && typeof countdown === 'number' && (
              <div className="text-center text-sm text-amber-400">
                Battle starts in {countdown}s
              </div>
            )}

            <input
              ref={inputRef}
              value={typed}
              onChange={e => handleChange(e.target.value)}
              onPaste={e => e.preventDefault()}
              onCopy={e => e.preventDefault()}
              disabled={status === 'finished'}
              className={`w-full p-3 rounded-xl border transition-colors duration-200 ${
                status === 'finished'
                  ? `${inputBase} opacity-60 cursor-not-allowed`
                  : inputBase
              }`}
              placeholder={raceLocked ? 'Waiting for race to start...' : status === 'finished' ? 'Test completed!' : 'Start typing here...'}
            />

            <StatsPanel wpm={stats.wpm} cpm={stats.cpm} accuracy={stats.accuracy} errors={stats.errors} elapsed={stats.elapsed} />
          </>
        )}
      </div>
    </section>
  );
}
