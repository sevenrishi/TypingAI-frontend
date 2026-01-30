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
  const [topic, setTopic] = React.useState('');
  const [length, setLength] = React.useState<'short'|'medium'|'long'>('short');

  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto">
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}> 
          <h2 className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Generated Script</h2>

          <div className="mb-4">
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Enter a prompt or topic to generate script"
              className={`w-full p-3 rounded-md border mb-3 transition-colors duration-200 ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
              }`}
            />

            <div className="flex items-center gap-3">
              <select value={length} onChange={e => setLength(e.target.value as any)} className={`p-2 rounded-md border transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>

              <button
                onClick={() => onGenerate(topic, length)}
                className={`px-4 py-2 rounded-md font-semibold ${isGenerating ? 'bg-gray-600 text-gray-200 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          <div className={`mb-4 p-4 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            {isGenerating ? (
              <div>⏳ Generating...</div>
            ) : text ? (
              <pre className="whitespace-pre-wrap">{text}</pre>
            ) : (
              <div className="text-sm text-gray-500">No script generated yet.</div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onUseScript(text)}
              disabled={!text}
              className={`px-4 py-2 rounded-md font-semibold ${!text ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
              Use this script
            </button>

            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-md font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
