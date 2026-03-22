export type RouteSeo = {
  title: string;
  description: string;
  robots?: string;
  ogType?: string;
  image?: string;
};

export const siteMeta = {
  name: 'TypingAI',
  title: 'TypingAI | Typing Test & AI Typing Practice (WPM, Accuracy)',
  description:
    'TypingAI is an AI-powered typing trainer with typing tests, personalized typing practice drills, live WPM and accuracy feedback, and multiplayer races.',
  locale: 'en_US',
  defaultImage: '/og-image.png',
  fallbackUrl: 'https://typingai.app',
};

export const routeSeo: Record<string, RouteSeo> = {
  '/': {
    title: siteMeta.title,
    description: siteMeta.description,
  },
  '/learn': {
    title: 'TypingAI Learn | Guided Typing Lessons and Curriculum',
    description: 'Master touch typing with guided lessons, finger placement drills, and structured practice plans.',
  },
  '/practice': {
    title: 'TypingAI Practice | Personalized Drills for Speed and Accuracy',
    description: 'Build custom typing practice sessions that target accuracy, rhythm, and real-world typing speed.',
  },
  '/typing': {
    title: 'TypingAI Typing Test | Real-Time WPM and Accuracy',
    description: 'Run live typing tests with instant WPM, accuracy, and rhythm feedback to track progress.',
  },
  '/battleground': {
    title: 'TypingAI Battleground | Multiplayer Typing Races',
    description: 'Race friends and rivals in real-time typing battles with live leaderboards and match stats.',
  },
  '/help': {
    title: 'TypingAI Help Center | Guides, FAQs, and Support',
    description: 'Find quick answers, onboarding guidance, and support for getting the most from TypingAI.',
  },
  '/login': {
    title: 'Sign In | TypingAI',
    description: 'Access your TypingAI dashboard, sessions, and personalized coaching.',
    robots: 'noindex,nofollow',
  },
  '/signup': {
    title: 'Create Your TypingAI Account',
    description: 'Join TypingAI to unlock guided lessons, competitive races, and personalized progress tracking.',
    robots: 'noindex,nofollow',
  },
  '/reset-password': {
    title: 'Reset Password | TypingAI',
    description: 'Reset your TypingAI password and regain access to your training history.',
    robots: 'noindex,nofollow',
  },
  '/activate': {
    title: 'Activate Account | TypingAI',
    description: 'Verify your TypingAI account to start training with AI-powered typing drills.',
    robots: 'noindex,nofollow',
  },
  '/profile': {
    title: 'Your Profile | TypingAI',
    description: 'Review your typing history, achievements, and session stats.',
    robots: 'noindex,nofollow',
  },
  '/account': {
    title: 'Account Settings | TypingAI',
    description: 'Manage your TypingAI account security, preferences, and profile details.',
    robots: 'noindex,nofollow',
  },
};

export function normalizePathname(pathname: string) {
  if (!pathname) return '/';
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function getSiteUrl() {
  const envUrl = import.meta.env.VITE_SITE_URL;
  const resolved = envUrl && envUrl.trim().length
    ? envUrl.trim()
    : (typeof window !== 'undefined' ? window.location.origin : siteMeta.fallbackUrl);
  return resolved.endsWith('/') ? resolved.slice(0, -1) : resolved;
}

export function buildCanonical(pathname: string) {
  const base = getSiteUrl();
  const path = pathname === '/' ? '/' : `/${pathname.replace(/^\//, '')}`;
  return `${base}${path}`;
}

export function resolveSeo(pathname: string) {
  const normalized = normalizePathname(pathname);
  return routeSeo[normalized] || routeSeo['/'];
}

export function resolveImage(image?: string) {
  const candidate = image || siteMeta.defaultImage;
  if (candidate.startsWith('http')) {
    return candidate;
  }
  const base = getSiteUrl();
  return `${base}${candidate.startsWith('/') ? '' : '/'}${candidate}`;
}
