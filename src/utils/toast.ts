export type ToastTone = 'success' | 'error' | 'info';

export type ToastDetail = {
  message: string;
  tone?: ToastTone;
  durationMs?: number;
};

export const TOAST_EVENT = 'typingai:toast';

export function showToast(detail: ToastDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail }));
}
