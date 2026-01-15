import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateAvatar } from '../profileSlice';
import { RootState } from '../../../store';
import { useTheme } from '../../../providers/ThemeProvider';
import { AVATARS, getAvatarColor } from '../../../utils/avatars';

function initials(name?: string) {
  if (!name) return 'U';
  return name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();
}

// Get list of avatar images from assets/avatars
const getAvatarImages = (): { name: string; src: string }[] => {
  const avatarImages: { name: string; src: string }[] = [];
  // Import all images from assets/avatars folder
  const context = import.meta.glob<{ default: string }>(
    '/src/assets/avatars/*',
    { eager: true, import: 'default' }
  );
  Object.entries(context).forEach(([path, src]) => {
    const filename = path.split('/').pop();
    if (filename) {
      avatarImages.push({
        name: filename.replace(/\.[^.]+$/, ''),
        src: src
      });
    }
  });
  return avatarImages;
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
  const { theme } = useTheme();
  const profile = useSelector((s: RootState) => s.profile);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(profile.user?.avatarId || '');
  const [avatarImages, setAvatarImages] = useState<{ name: string; src: string }[]>([]);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    dispatch(fetchProfile() as any); 
    setAvatarImages(getAvatarImages());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false);
      }
    };
    if (showAvatarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAvatarMenu]);

  const recent = Array.isArray(profile.history) ? profile.history.slice().reverse() : [];

  const handleAvatarSelect = async (avatarName: string) => {
    setSelectedAvatarId(avatarName);
    try {
      await dispatch(updateAvatar(avatarName) as any);
      setShowAvatarMenu(false);
    } catch (err) {
      console.error('Failed to update avatar', err);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-40 transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-black/40'
        : 'bg-black/20'
    }`}>
      <div className={`p-6 rounded-lg w-11/12 max-w-3xl shadow-xl transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-900 text-gray-100'
          : 'bg-white text-gray-900'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white border-2 border-white cursor-pointer transition-transform duration-200 hover:scale-110 ${selectedAvatarId ? 'bg-gray-600' : getAvatarColor('avatar-1')} overflow-hidden`}
              >
                {selectedAvatarId ? (
                  <img 
                    src={avatarImages.find(a => a.name === selectedAvatarId)?.src || ''}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials(profile.user?.displayName)
                )}
              </div>

              {showAvatarMenu && (
                <div 
                  ref={avatarMenuRef}
                  className={`absolute z-50 mt-2 rounded-lg shadow-2xl p-6 top-24 left-0 grid grid-cols-4 gap-4 min-w-96 ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
                  }`}
                >
                  <div className="col-span-4">
                    <h4 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      Select Avatar
                    </h4>
                  </div>
                  {avatarImages.length > 0 ? (
                    avatarImages.map((avatar) => (
                      <button
                        key={avatar.name}
                        onClick={() => handleAvatarSelect(avatar.name)}
                        className={`relative group w-20 h-20 rounded-full overflow-hidden transition-transform duration-200 hover:scale-110 border-2 ${
                          selectedAvatarId === avatar.name 
                            ? 'border-indigo-500 ring-2 ring-indigo-400' 
                            : theme === 'dark'
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        title={avatar.name}
                      >
                        <img 
                          src={avatar.src}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))
                  ) : (
                    <div className={`col-span-4 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      No avatars found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold">{profile.user?.displayName || 'Guest'}</h3>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {profile.user?.email || ''}
              </div>
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={onClose}
              className={`px-3 py-1 rounded transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className={`p-4 rounded transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800'
              : 'bg-gray-100'
          }`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Best WPM
            </div>
            <div className="text-2xl font-semibold">{Math.round(profile.bestWPM || 0)}</div>
          </div>
          <div className={`p-4 rounded transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800'
              : 'bg-gray-100'
          }`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Average Accuracy
            </div>
            <div className="text-2xl font-semibold">{Math.round(profile.averageAccuracy || 0)}%</div>
          </div>
          <div className={`p-4 rounded transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800'
              : 'bg-gray-100'
          }`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Tests
            </div>
            <div className="text-2xl font-semibold">{(profile.history || []).length}</div>
          </div>
        </div>

        <h4 className="font-medium mb-2">Typing Performance Matrix</h4>
        <div className="grid grid-cols-10 gap-2 mb-4">
          {Array.from({ length: 30 }).map((_, i) => {
            const r = recent[i];
            const acc = r ? Math.round(r.accuracy) : null;
            const cls = acc == null
              ? theme === 'dark'
                ? 'bg-gray-700/40'
                : 'bg-gray-300/40'
              : colorForAccuracy(acc);
            const title = r ? `${Math.round(r.wpm)} wpm • ${Math.round(r.accuracy)}%` : 'No data';
            return (
              <div
                key={i}
                title={title}
                className={`h-8 rounded flex items-center justify-center text-xs ${
                  r
                    ? 'text-white'
                    : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-500'
                } ${cls}`}
              >
                {r ? Math.round(r.accuracy) + '%' : ''}
              </div>
            );
          })}
        </div>

        <h4 className="font-medium mb-2">Recent Tests</h4>
        <div className="max-h-64 overflow-auto space-y-2">
          {recent.length === 0 && (
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No test history yet.
            </div>
          )}
          {recent.map((r: any) => (
            <div
              key={r._id}
              className={`p-3 rounded flex items-center justify-between transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800'
                  : 'bg-gray-100'
              }`}
            >
              <div>
                <div className="text-sm font-medium">{r.text?.slice(0, 60) || 'Test'}</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{Math.round(r.wpm)} WPM</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.round(r.accuracy)}% • {r.errors} err
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
