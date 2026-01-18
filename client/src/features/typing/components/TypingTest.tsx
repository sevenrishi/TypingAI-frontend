import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { generateText } from '../../ai/aiSlice';
import TextDisplay from './TextDisplay';
import StatsPanel from './StatsPanel';
import ResultsModal from './ResultsModal';
import { saveResult } from '../typingSlice';
import { useTyping } from '../hooks/useTyping';
import { loadText as loadTextAction } from '../typingSlice';
import { useTheme } from '../../../providers/ThemeProvider';

export default function TypingTest() {
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const aiText = useSelector((s: RootState) => s.ai.text);
  const roomId = useSelector((s: RootState) => s.room.roomId);
  const roomText = useSelector((s: RootState) => s.room.text);
  const { typed, text, status, stats, showResults, setShowResults, handleChange, handleReset, raceLocked, countdown } = useTyping();

  const [topic, setTopic] = useState('');
  const [length, setLength] = useState<'short'|'medium'|'long'>('short');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // when AI text changes, load into typing slice
  React.useEffect(() => {
    if (aiText) dispatch(loadTextAction(aiText));
  }, [aiText, dispatch]);

  const handleStart = async () => {
    if (!topic.trim()) {
      setError('Give an input to generate the script');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    await dispatch(generateText({ topic, length }));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gray-800/40 backdrop-blur-md'
        : 'bg-white border border-gray-300'
    }`}>
      <div className="flex flex-col gap-4">
        {!roomId ? (
          // Solo mode - show generation controls
          <div className="flex flex-wrap gap-3 items-center">
            <input 
              className={`flex-1 min-w-[160px] p-2 rounded-md border transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Enter a topic to generate your typing script using AI"
            />
            <select 
              value={length}
              onChange={e => setLength(e.target.value as any)}
              className={`p-2 rounded-md border transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
            <button 
              onClick={handleStart}
              disabled={!topic.trim()}
              className={`px-4 py-2 rounded-md shadow transition-colors duration-200 ${
                !topic.trim()
                  ? theme === 'dark'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                  : theme === 'dark'
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              Generate
            </button>
            <button 
              onClick={() => handleReset()}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
              }`}
            >
              Reset
            </button>
          </div>
          ) : (
            // Battle mode - show room info and reset button only
            <div className="flex flex-wrap gap-3 items-center">
              <div className={`flex-1 px-4 py-2 rounded-md border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-200'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}>
              <span className="font-semibold">Room:</span> {roomId}
            </div>
            <button 
              onClick={() => handleReset()}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-900'
              }`}
            >
              Reset
            </button>
          </div>
        )}

        {error && (
          <div className={`p-3 rounded-md text-sm font-medium ${
            theme === 'dark'
              ? 'bg-red-900/30 border border-red-700 text-red-300'
              : 'bg-red-100 border border-red-400 text-red-800'
          }`}>
            {error}
          </div>
        )}

        <div className={`rounded-md overflow-hidden border p-4 h-48 transition-colors duration-300 ${
          theme === 'dark'
            ? 'border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800'
            : 'border-gray-300 bg-gray-50'
        }`}>
          <TextDisplay text={text} typed={typed} />
        </div>

        {raceLocked && typeof countdown === 'number' && (
          <div className={`text-center text-sm ${
            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
          }`}>
            Race starts in {countdown}s
          </div>
        )}

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
        />

        <StatsPanel wpm={stats.wpm} cpm={stats.cpm} accuracy={stats.accuracy} errors={stats.errors} elapsed={stats.elapsed} />

        <ResultsModal visible={showResults} onClose={() => setShowResults(false)} stats={stats} onSave={() => {
          (async () => {
            try {
              await dispatch(saveResult({ wpm: stats.wpm, cpm: stats.cpm, accuracy: stats.accuracy, errors: stats.errors, duration: stats.elapsed, text }));
            } catch (err) {
              console.error('save failed', err);
            }
            setShowResults(false);
          })();
        }} />
      </div>
    </div>
  );
}
