import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';

export type Finger =
  | 'leftPinky'
  | 'leftRing'
  | 'leftMiddle'
  | 'leftIndex'
  | 'rightIndex'
  | 'rightMiddle'
  | 'rightRing'
  | 'rightPinky';

export const FINGER_LABELS: Record<Finger, string> = {
  leftPinky: 'Left Pinky',
  leftRing: 'Left Ring',
  leftMiddle: 'Left Middle',
  leftIndex: 'Left Index',
  rightIndex: 'Right Index',
  rightMiddle: 'Right Middle',
  rightRing: 'Right Ring',
  rightPinky: 'Right Pinky'
};

const FINGER_STYLES: Record<Finger, string> = {
  leftPinky: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  leftRing: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  leftMiddle: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  leftIndex: 'bg-lime-500/15 text-lime-400 border-lime-500/30',
  rightIndex: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rightMiddle: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  rightRing: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  rightPinky: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
};

export const KEY_FINGER_MAP: Record<string, Finger> = {
  '1': 'leftPinky',
  '2': 'leftRing',
  '3': 'leftMiddle',
  '4': 'leftIndex',
  '5': 'leftIndex',
  '6': 'rightIndex',
  '7': 'rightIndex',
  '8': 'rightMiddle',
  '9': 'rightRing',
  '0': 'rightPinky',
  q: 'leftPinky',
  w: 'leftRing',
  e: 'leftMiddle',
  r: 'leftIndex',
  t: 'leftIndex',
  y: 'rightIndex',
  u: 'rightIndex',
  i: 'rightMiddle',
  o: 'rightRing',
  p: 'rightPinky',
  a: 'leftPinky',
  s: 'leftRing',
  d: 'leftMiddle',
  f: 'leftIndex',
  g: 'leftIndex',
  h: 'rightIndex',
  j: 'rightIndex',
  k: 'rightMiddle',
  l: 'rightRing',
  ';': 'rightPinky',
  "'": 'rightPinky',
  z: 'leftPinky',
  x: 'leftRing',
  c: 'leftMiddle',
  v: 'leftIndex',
  b: 'leftIndex',
  n: 'rightIndex',
  m: 'rightIndex',
  ',': 'rightMiddle',
  '.': 'rightRing',
  '/': 'rightPinky',
  '-': 'rightPinky',
  '=': 'rightPinky'
};

export const SHIFT_BASE_MAP: Record<string, string> = {
  '!': '1',
  '@': '2',
  '#': '3',
  '$': '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  ':': ';',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/'
};

const KEY_ROWS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

interface KeyboardFingerPlacementProps {
  focusKeys: string[];
  className?: string;
  showLegend?: boolean;
  compact?: boolean;
  activeKey?: string;
}

export default function KeyboardFingerPlacement({
  focusKeys,
  className,
  showLegend = true,
  compact = false,
  activeKey
}: KeyboardFingerPlacementProps) {
  const { theme } = useTheme();
  const activeKeyNormalized = React.useMemo(() => {
    if (!activeKey) return '';
    if (SHIFT_BASE_MAP[activeKey]) return SHIFT_BASE_MAP[activeKey];
    const lower = activeKey.toLowerCase();
    if (SHIFT_BASE_MAP[lower]) return SHIFT_BASE_MAP[lower];
    if (activeKey.length > 1) return '';
    if (activeKey === ' ') return '';
    return lower;
  }, [activeKey]);

  const focusSet = React.useMemo(() => {
    const set = new Set<string>();
    focusKeys.forEach((key) => {
      const trimmed = key.trim();
      if (!trimmed) return;
      const lower = trimmed.toLowerCase();
      set.add(lower);
      if (SHIFT_BASE_MAP[trimmed]) set.add(SHIFT_BASE_MAP[trimmed]);
      if (SHIFT_BASE_MAP[lower]) set.add(SHIFT_BASE_MAP[lower]);
    });
    return set;
  }, [focusKeys]);

  const showNumberRow = KEY_ROWS[0].some((key) => focusSet.has(key) || activeKeyNormalized === key);
  const hasShiftSymbols = focusKeys.some((key) => SHIFT_BASE_MAP[key] || SHIFT_BASE_MAP[key.toLowerCase()]);

  const keyBaseClasses = compact
    ? 'w-8 h-8 text-[11px] max-sm:w-7 max-sm:h-7 max-sm:text-[10px]'
    : 'w-9 h-9 text-sm max-sm:w-7 max-sm:h-7 max-sm:text-[10px]';
  const keyInactiveClasses =
    theme === 'dark'
      ? 'bg-gray-900/60 border-gray-700 text-gray-500'
      : 'bg-white border-gray-300 text-gray-500';
  const activeKeyClasses =
    theme === 'dark'
      ? 'ring-2 ring-white/70 shadow-[0_0_12px_rgba(255,255,255,0.35)] scale-[1.05]'
      : 'ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.35)] scale-[1.05]';

  return (
    <div className={className}>
      {showLegend && (
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(FINGER_LABELS) as Finger[]).map((finger) => (
            <div
              key={finger}
              className={`px-2 py-1 rounded border text-xs font-semibold ${FINGER_STYLES[finger]}`}
            >
              {FINGER_LABELS[finger]}
            </div>
          ))}
        </div>
      )}

      <div className={`flex flex-col gap-2 ${compact ? 'items-start' : 'items-center'}`}>
        {KEY_ROWS.map((row, rowIndex) => {
          if (rowIndex === 0 && !showNumberRow) return null;
          const indentClass = rowIndex === 2 ? 'ml-3 max-sm:ml-1' : rowIndex === 3 ? 'ml-6 max-sm:ml-2' : '';
          return (
            <div key={`row-${rowIndex}`} className={`flex gap-2 ${indentClass}`}>
              {row.map((key) => {
                const finger = KEY_FINGER_MAP[key];
                const isFocused = focusSet.has(key);
                const isActive = activeKeyNormalized === key;
                const styleClass = isFocused && finger ? FINGER_STYLES[finger] : keyInactiveClasses;
                return (
                  <div
                    key={key}
                    className={`relative flex items-center justify-center rounded-md border font-mono uppercase transition-all ${keyBaseClasses} ${styleClass} ${
                      isActive ? activeKeyClasses : ''
                    }`}
                    aria-label={`${key} key`}
                  >
                    {key}
                    {(key === 'f' || key === 'j') && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-current opacity-70" />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {hasShiftSymbols && (
        <p className={`mt-3 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Tip: Hold Shift with the opposite hand to keep your typing flow smooth.
        </p>
      )}
    </div>
  );
}
