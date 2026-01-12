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

export default function TypingTest() {
  const dispatch = useAppDispatch();
  const aiText = useSelector((s: RootState) => s.ai.text);
  const { typed, text, status, stats, showResults, setShowResults, handleChange, handleReset, raceLocked, countdown } = useTyping();

  const [topic, setTopic] = useState('Nature');
  const [length, setLength] = useState<'short'|'medium'|'long'>('short');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // when AI text changes, load into typing slice
  React.useEffect(() => {
    if (aiText) dispatch(loadTextAction(aiText));
  }, [aiText, dispatch]);

  const handleStart = async () => {
    await dispatch(generateText({ topic, length }));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input className="flex-1 min-w-[160px] p-2 rounded-md bg-gray-700 border border-gray-600" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic" />
          <select value={length} onChange={e => setLength(e.target.value as any)} className="p-2 rounded-md bg-gray-700 border border-gray-600">
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
          <button onClick={handleStart} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md shadow">Generate</button>
          <button onClick={() => handleReset()} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md">Reset</button>
        </div>

        <div className="rounded-md overflow-hidden border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 p-4 h-48">
          <TextDisplay text={text} typed={typed} />
        </div>

        {raceLocked && typeof countdown === 'number' && (
          <div className="text-center text-sm text-yellow-400">Race starts in {countdown}s</div>
        )}

        <input
          ref={inputRef}
          value={typed}
          onChange={e => handleChange(e.target.value)}
          onPaste={e => e.preventDefault()}
          onCopy={e => e.preventDefault()}
          className="w-full p-3 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400"
          placeholder={raceLocked ? 'Waiting for race to start...' : 'Start typing here...'}
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
