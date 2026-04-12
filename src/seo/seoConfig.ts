export type FaqEntry = {
  question: string;
  answer: string;
};

export type RouteSeo = {
  title: string;
  description: string;
  robots?: string;
  ogType?: string;
  image?: string;
  keywords?: string[];
  schemaType?: string;
  faqs?: FaqEntry[];
};

const sharedKeywords = [
  'typingai',
  'typing ai',
  'typing test',
  'typing practice',
  'touch typing lessons',
  'typing speed test',
  'wpm test',
  'typing accuracy',
];

const learningKeywords = [
  'learn typing online',
  'ai typing tutor',
  'touch typing course',
  'keyboard finger placement',
  'typing lessons',
  'typing curriculum',
  'ai for typing',
  'learn smarter with personalized typing analysis',
];

const practiceKeywords = [
  'ai typing practice',
  'typing practice ai',
  'typing drills',
  'typing exercises',
  'improve typing speed',
  'improve typing accuracy',
  'daily typing practice',
  'ai typewriting practice',
  'live practice typing',
  'ai keyboard typing practice',
  'free typing practice with ai',
  'ai typing practice free',
];

const typingTestKeywords = [
  'typing test ai',
  'typingtest ai',
  'ai typing test',
  'online typing test ai',
  'typing ai for test',
  'ai typing speed',
];

const battlegroundKeywords = [
  'multiplayer typing race',
  'online typing game',
  'typing competition',
  'typing battle',
  'live typing race',
  'ai typing simulation',
];

export const helpCenterFaqs: FaqEntry[] = [
  {
    question: 'What is an AI typing tutor?',
    answer:
      'An AI typing tutor adapts drills, pacing, and feedback to your skill level so you can improve speed, accuracy, and typing consistency faster.',
  },
  {
    question: 'Which app or AI can help practice typing proficiency?',
    answer:
      'TypingAI is built for typing proficiency practice with AI-generated drills, typing tests, touch typing lessons, and personalized typing analysis.',
  },
  {
    question: 'Is there a free AI typing practice website?',
    answer:
      'TypingAI offers free account-based access so you can start AI typing practice, measure WPM, and improve typing accuracy online.',
  },
  {
    question: 'Can I use TypingAI as an online AI typing test?',
    answer:
      'Yes. You can use TypingAI for an online AI typing test with live WPM, typing accuracy, and session feedback.',
  },
  {
    question: 'How is WPM calculated in a typing test?',
    answer:
      'TypingAI calculates words per minute by dividing the number of typed characters by five and then scaling that number to one minute.',
  },
  {
    question: 'What is a good typing accuracy score?',
    answer:
      'A strong typing accuracy score is usually 95 percent or higher, because high accuracy creates the consistency you need to increase speed.',
  },
  {
    question: 'How can I improve typing speed without losing accuracy?',
    answer:
      'Focus on smooth keystrokes, use touch typing habits, and practice short drills that target your weakest keys before pushing for more speed.',
  },
  {
    question: 'What is touch typing and why does it matter?',
    answer:
      'Touch typing means typing without looking at the keyboard, which improves muscle memory, reduces hesitation, and helps you reach higher WPM with fewer errors.',
  },
];

export const siteMeta = {
  name: 'TypingAI',
  title: 'TypingAI | AI Typing Tutor, Typing Test & Practice',
  description:
    'TypingAI is an AI typing tutor for typing tests, AI typing practice, touch typing lessons, and personalized typing analysis that improves WPM and accuracy.',
  locale: 'en_US',
  defaultImage: '/og-image.png',
  fallbackUrl: 'https://typingai.live',
  keywords: sharedKeywords,
};

export const routeSeo: Record<string, RouteSeo> = {
  '/': {
    title: siteMeta.title,
    description: siteMeta.description,
    keywords: [
      ...sharedKeywords,
      'typing trainer',
      'ai typing tutor',
      'ai typing practice',
      'learn typing online',
      '1 minute typing test',
    ],
  },
  '/learn': {
    title: 'AI Typing Tutor | Touch Typing Lessons | TypingAI',
    description:
      'Learn touch typing online with an AI typing tutor, keyboard finger placement guidance, and personalized typing analysis for speed and accuracy.',
    keywords: [...sharedKeywords, ...learningKeywords],
    schemaType: 'CollectionPage',
  },
  '/practice': {
    title: 'AI Typing Practice | Free Typing Practice with AI | TypingAI',
    description:
      'Start AI typing practice with free account access, custom drills, live practice typing, and keyboard-focused exercises for better speed and accuracy.',
    keywords: [...sharedKeywords, ...practiceKeywords],
    schemaType: 'CollectionPage',
  },
  '/typing': {
    title: 'AI Typing Test | Online Typing Test AI | TypingAI',
    description:
      'Take an AI typing test with live WPM, typing accuracy, rhythm feedback, and online practice built for typing speed improvement.',
    keywords: [
      ...sharedKeywords,
      ...typingTestKeywords,
      'typing speed test',
      'typing accuracy test',
      '1 minute typing test',
    ],
    schemaType: 'WebApplication',
  },
  '/battleground': {
    title: 'Multiplayer Typing Race | TypingAI Battleground',
    description:
      'Join multiplayer typing races, compare WPM live, and compete in online typing battles with real-time leaderboards.',
    keywords: [...sharedKeywords, ...battlegroundKeywords],
    schemaType: 'WebApplication',
  },
  '/help': {
    title: 'AI Typing Tutor FAQs & Typing Help | TypingAI',
    description:
      'Get help with AI typing tests, typing practice, WPM, typing accuracy, account issues, and personalized typing analysis in the TypingAI support hub.',
    keywords: [
      ...sharedKeywords,
      'which app or ai can practice typing proficiency',
      'any knew ai website for typing practice',
      'typing help',
      'typing faq',
      'typing tips',
      'wpm calculator help',
    ],
    schemaType: 'FAQPage',
    faqs: helpCenterFaqs,
  },
  '/privacy': {
    title: 'Privacy Policy | TypingAI',
    description:
      'Read how TypingAI collects, uses, stores, and protects account data, typing session history, analytics, and AI practice information.',
    keywords: [
      ...sharedKeywords,
      'privacy policy',
      'data collection',
      'account security',
      'typing session history',
    ],
    schemaType: 'WebPage',
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

export function uniqueKeywords(keywords: string[] = []) {
  return Array.from(new Set(
    keywords
      .map((keyword) => keyword.trim())
      .filter(Boolean)
  ));
}

export function resolveImage(image?: string) {
  const candidate = image || siteMeta.defaultImage;
  if (candidate.startsWith('http')) {
    return candidate;
  }
  const base = getSiteUrl();
  return `${base}${candidate.startsWith('/') ? '' : '/'}${candidate}`;
}
