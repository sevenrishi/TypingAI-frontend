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
  const aiText = useSelector((s: RootState) => s.aiMultiplayer.text);
  const { typed, text, status, stats, handleChange, raceLocked, countdown } = useTyping();

  const inputRef = useRef<HTMLInputElement | null>(null);

  // when AI text changes, load into typing slice
  React.useEffect(() => {
    if (aiText) dispatch(loadTextAction(aiText));
  }, [aiText, dispatch]);

  return (
    <div className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/40 backdrop-blur-md'
        : 'bg-white border border-gray-300'
    }`}>
      <div className="flex flex-col gap-4">
        {/* Script display */}
        <div className={`rounded-md overflow-hidden border p-4 h-48 transition-colors duration-300 ${
          theme === 'dark'
            ? 'border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800'
            : 'border-gray-300 bg-gray-50'
        }`}>
          <TextDisplay text={text} typed={typed} />
        </div>

        {/* Race countdown */}
        {raceLocked && typeof countdown === 'number' && (
          <div className={`text-center text-sm ${
            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
          }`}>
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
          className={`w-full p-3 rounded-md border transition-colors duration-200 ${
            status === 'finished'
              ? theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-gray-400 placeholder-gray-500 cursor-not-allowed'
                : 'border-gray-300 bg-gray-100 text-gray-500 placeholder-gray-400 cursor-not-allowed'
              : theme === 'dark'
              ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400'
              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
          }`}
          placeholder={raceLocked ? 'Waiting for race to start...' : status === 'finished' ? 'Test completed!' : 'Start typing here...'}
          autoFocus
        />

        {/* Stats panel */}
        <StatsPanel wpm={stats.wpm} cpm={stats.cpm} accuracy={stats.accuracy} errors={stats.errors} elapsed={stats.elapsed} />
      </div>
    </div>
  );
}
