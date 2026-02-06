import React, { useRef } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import TextDisplay from './TextDisplay';
import StatsPanel from './StatsPanel';
import { useTyping } from '../hooks/useTyping';
import { loadText as loadTextAction } from '../typingSlice';
import { useTheme } from '../../../providers/ThemeProvider';

export default function TypingBattleground() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const aiText = useSelector((s: RootState) => s.aiMultiplayer.text);
  const { typed, text, status, stats, handleChange, raceLocked, countdown } = useTyping();

  const inputRef = useRef<HTMLInputElement | null>(null);

  // when AI text changes, load into typing slice
  React.useEffect(() => {
    if (aiText) dispatch(loadTextAction(aiText));
  }, [aiText, dispatch]);

  return (
    <section
      className={`p-6 md:p-8 rounded-[28px] border shadow-lg transition-colors duration-300 ${
        isDark
          ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
          : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl'
      }`}
    >
      <div className="flex flex-col gap-5">
        {/* Script display */}
        <div
          className={`rounded-2xl overflow-hidden border p-4 h-52 ${
            isDark
              ? 'bg-slate-900/45 border-slate-700/50'
              : 'bg-white/60 border-slate-200/80'
          }`}
        >
          <TextDisplay text={text} typed={typed} />
        </div>

        {/* Race countdown */}
        {raceLocked && typeof countdown === 'number' && (
          <div className="text-center text-sm text-amber-400">
            Race starts in {countdown}s
          </div>
        )}

        {/* Typing input */}
        <input
          ref={inputRef}
          value={typed}
          onChange={e => handleChange(e.target.value)}
          onPaste={e => e.preventDefault()}
          onCopy={e => e.preventDefault()}
          disabled={status === 'finished'}
          className={`w-full p-3 rounded-xl border transition-colors duration-200 ${
            status === 'finished'
              ? isDark
                ? 'border-slate-700 bg-slate-900/60 text-slate-500 placeholder-slate-600 cursor-not-allowed'
                : 'border-slate-200 bg-slate-100 text-slate-500 placeholder-slate-400 cursor-not-allowed'
              : isDark
              ? 'border-slate-700 bg-slate-900/60 text-slate-100 placeholder-slate-500'
              : 'border-slate-200 bg-white text-slate-900 placeholder-slate-500'
          }`}
          placeholder={raceLocked ? 'Waiting for race to start...' : status === 'finished' ? 'Test completed!' : 'Start typing here...'}
          autoFocus
        />

        {/* Stats panel */}
        <StatsPanel wpm={stats.wpm} cpm={stats.cpm} accuracy={stats.accuracy} errors={stats.errors} elapsed={stats.elapsed} />
      </div>
    </section>
  );
}
