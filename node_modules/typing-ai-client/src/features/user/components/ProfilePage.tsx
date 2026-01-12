import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../profileSlice';
import { RootState } from '../../../store';

function initials(name?: string) {
  if (!name) return 'U';
  return name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
}

function colorForAccuracy(acc: number) {
  // 0-50 red, 50-80 yellow, 80-100 green
  if (acc >= 90) return 'bg-green-500';
  if (acc >= 75) return 'bg-yellow-400';
  if (acc >= 50) return 'bg-orange-400';
  return 'bg-red-500';
}

export default function ProfilePage({ onClose }: { onClose: () => void }) {
  const dispatch = useDispatch();
  const profile = useSelector((s: RootState) => s.profile);

  useEffect(() => { dispatch(fetchProfile() as any); }, [dispatch]);

  const recent = Array.isArray(profile.history) ? profile.history.slice().reverse() : [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg w-11/12 max-w-3xl shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">{initials(profile.user?.displayName)}</div>
            <div>
              <h3 className="text-2xl font-bold">{profile.user?.displayName || 'Guest'}</h3>
              <div className="text-sm text-gray-300">{profile.user?.email || ''}</div>
            </div>
          </div>
          <div className="text-right">
            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">Close</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-gray-800 rounded">
            <div className="text-xs text-gray-400">Best WPM</div>
            <div className="text-2xl font-semibold">{Math.round(profile.bestWPM || 0)}</div>
          </div>
          <div className="p-4 bg-gray-800 rounded">
            <div className="text-xs text-gray-400">Average Accuracy</div>
            <div className="text-2xl font-semibold">{Math.round(profile.averageAccuracy || 0)}%</div>
          </div>
          <div className="p-4 bg-gray-800 rounded">
            <div className="text-xs text-gray-400">Total Tests</div>
            <div className="text-2xl font-semibold">{(profile.history || []).length}</div>
          </div>
        </div>

        <h4 className="font-medium mb-2">Typing Performance Matrix</h4>
        <div className="grid grid-cols-10 gap-2 mb-4">
          {Array.from({ length: 30 }).map((_, i) => {
            const r = recent[i];
            const acc = r ? Math.round(r.accuracy) : null;
            const cls = acc == null ? 'bg-gray-700/40' : colorForAccuracy(acc);
            const title = r ? `${Math.round(r.wpm)} wpm • ${Math.round(r.accuracy)}%` : 'No data';
            return (
              <div key={i} title={title} className={`h-8 rounded ${cls} flex items-center justify-center text-xs ${r ? 'text-white' : 'text-gray-400'}`}>
                {r ? Math.round(r.accuracy) + '%' : ''}
              </div>
            );
          })}
        </div>

        <h4 className="font-medium mb-2">Recent Tests</h4>
        <div className="max-h-64 overflow-auto space-y-2">
          {recent.length === 0 && <div className="text-sm text-gray-400">No test history yet.</div>}
          {recent.map((r: any) => (
            <div key={r._id} className="p-3 bg-gray-800 rounded flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{r.text?.slice(0, 60) || 'Test'}</div>
                <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{Math.round(r.wpm)} WPM</div>
                <div className="text-sm text-gray-300">{Math.round(r.accuracy)}% • {r.errors} err</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
