import React, { useEffect, useState } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { TOAST_EVENT, ToastDetail, ToastTone } from '../utils/toast';

type Toast = {
  id: number;
  message: string;
  tone: ToastTone;
  durationMs: number;
};

const toneStyles: Record<ToastTone, { ring: string; bg: string; text: string }> = {
  success: { ring: 'ring-emerald-400/40', bg: 'bg-emerald-500/10', text: 'text-emerald-200' },
  error: { ring: 'ring-rose-400/40', bg: 'bg-rose-500/10', text: 'text-rose-200' },
  info: { ring: 'ring-cyan-400/40', bg: 'bg-cyan-500/10', text: 'text-cyan-200' }
};

export default function ToastHost() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      if (!detail?.message) return;
      const toast: Toast = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        message: detail.message,
        tone: detail.tone || 'info',
        durationMs: detail.durationMs || 3500
      };
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.durationMs);
    };

    window.addEventListener(TOAST_EVENT, handleToast as EventListener);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast as EventListener);
    };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 max-w-[90vw]">
      {toasts.map((toast) => {
        const style = toneStyles[toast.tone];
        return (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-lg ring-1 ${style.ring} ${style.bg} ${
              isDark ? 'border-slate-700/60 text-slate-100' : 'border-slate-200 text-slate-900'
            }`}
          >
            <div className={`text-sm font-semibold ${style.text}`}>{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
}
