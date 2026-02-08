import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

interface ScriptReviewProps {
  text: string;
  isGenerating: boolean;
  onGenerate: (topic: string, length: 'short' | 'medium' | 'long') => void;
  onUseScript: (text: string) => void;
  onCancel: () => void;
}

export default function ScriptReview({ text, isGenerating, onGenerate, onUseScript, onCancel }: ScriptReviewProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [topic, setTopic] = React.useState('');
  const [length, setLength] = React.useState<'short'|'medium'|'long'>('short');
  const isGenerateDisabled = isGenerating || topic.trim().length === 0;
  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100'
    : 'bg-white/60 border-slate-200/80 text-slate-900';
  const inputBase = isDark
    ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500';
  const primaryButton = isDark
    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900'
    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white';
  const ghostButton = isDark
    ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
    : 'bg-slate-200 text-slate-700 hover:bg-slate-300';
  const disabledButton = isDark
    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
    : 'bg-slate-200 text-slate-500 cursor-not-allowed';

  return (
    <div className="min-h-[75vh] p-4">
      <div className="container mx-auto">
        <div className={`p-6 rounded-[28px] border shadow-lg ${surface}`}> 
          <div className="space-y-2 mb-6">
            <div
              className={`text-[11px] uppercase tracking-[0.35em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Host Tools
            </div>
            <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
              Generated script
            </h2>
          </div>

          <div className="mb-4 space-y-3">
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Enter a prompt or topic to generate script"
              className={`w-full p-3 rounded-xl border transition-colors duration-200 ${inputBase}`}
            />

            <div className="flex flex-wrap items-center gap-3">
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
                disabled={isGenerateDisabled}
                onClick={() => onGenerate(topic, length)}
                className={`px-4 py-3 rounded-xl font-semibold transition-colors duration-200 ${
                  isGenerateDisabled
                    ? isDark
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : primaryButton
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          <div className={`mb-4 p-4 rounded-2xl border ${surfaceSoft}`}>
            {isGenerating ? (
              <div>Generating...</div>
            ) : text ? (
              <pre className="whitespace-pre-wrap">{text}</pre>
            ) : (
              <div className="text-sm text-slate-400">No script generated yet.</div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onUseScript(text)}
              disabled={!text}
              className={`px-4 py-3 rounded-xl font-semibold ${
                !text ? disabledButton : primaryButton
              }`}
            >
              Use this script
            </button>

            <button
              onClick={onCancel}
              className={`px-4 py-3 rounded-xl font-medium ${ghostButton}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
