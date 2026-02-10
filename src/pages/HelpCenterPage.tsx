import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../providers/ThemeProvider';
import { BookOpen, MessageCircle, Search, Sparkles, Swords, Target } from 'lucide-react';

export default function HelpCenterPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100 backdrop-blur-md'
    : 'bg-white/60 border-slate-200 text-slate-900 backdrop-blur-md';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const accentText = isDark ? 'text-cyan-300' : 'text-sky-600';

  const helpCards = [
    {
      title: 'Getting started',
      description: 'Set up your first test and build a routine.',
      icon: <Sparkles className="h-5 w-5" />,
      href: '/learn',
    },
    {
      title: 'Practice plans',
      description: 'Create drills that target speed and accuracy.',
      icon: <Target className="h-5 w-5" />,
      href: '/practice',
    },
    {
      title: 'Battleground',
      description: 'Join races, climb ranks, and review match stats.',
      icon: <Swords className="h-5 w-5" />,
      href: '/battleground',
    },
    {
      title: 'Account help',
      description: 'Update your profile, password, and preferences.',
      icon: <BookOpen className="h-5 w-5" />,
      href: '/account',
    },
  ];

  const faqs = [
    {
      question: 'How is WPM calculated?',
      answer:
        'TypingAI measures words per minute by counting characters typed, dividing by five, then scaling by time.',
    },
    {
      question: 'Why do my accuracy numbers change between modes?',
      answer:
        'Practice drills, tests, and battles score errors differently to match the goal of each mode.',
    },
    {
      question: 'Can I recover a deleted session?',
      answer:
        'Session history is stored in your profile. If you clear local data, contact support for recovery options.',
    },
    {
      question: 'How do I change my avatar?',
      answer:
        'Open your profile, click the avatar circle, and pick a new style from the grid.',
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <section
        className={`relative overflow-hidden rounded-[32px] border p-8 md:p-10 ${
          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${isDark ? 'hero-grid-dark' : 'hero-grid-light'}`} />
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-16 -right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>
        <div className="relative z-10 space-y-4">
          <div
            className={`text-xs uppercase tracking-[0.35em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Support hub
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
          >
            Help center
          </h1>
          <p className={`text-lg ${mutedText}`}>
            Find the fastest path to better typing sessions, answers, and resources.
          </p>
          <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
            <Search className={`h-4 w-4 ${accentText}`} />
            <input
              type="search"
              placeholder="Search drills, guides, or account topics"
              className={`w-full bg-transparent text-sm outline-none ${isDark ? 'placeholder:text-slate-500' : 'placeholder:text-slate-400'}`}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {helpCards.map((card) => (
          <Link
            key={card.title}
            to={card.href}
            className={`group rounded-3xl border p-6 transition-all duration-300 ${surface}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {card.title}
                </div>
                <p className="mt-3 text-lg font-semibold">{card.description}</p>
              </div>
              <div
                className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                  isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <span className={accentText}>{card.icon}</span>
              </div>
            </div>
            <div className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${accentText}`}>
              Open guide
              <span className="text-base">&gt;</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={`rounded-3xl border p-6 ${surface}`}>
          <h2 className="text-xl font-semibold">Frequently asked</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className={`rounded-2xl border p-4 ${surfaceSoft}`}>
                <div className="text-sm font-semibold">{faq.question}</div>
                <p className={`mt-2 text-sm ${mutedText}`}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-3xl border p-6 ${surface}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Need more help?</h2>
              <p className={`mt-2 ${mutedText}`}>
                Our support team can help you recover sessions, fix account issues, or plan training.
              </p>
            </div>
            <span className={accentText}>
              <MessageCircle className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
              Email us: <span className="font-semibold">support@typingai.app</span>
            </div>
            <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
              Response time: <span className="font-semibold">within 24 hours</span>
            </div>
          </div>
          <Link
            to="/learn"
            className={`mt-6 inline-flex items-center gap-2 rounded-xl border px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              isDark
                ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
            }`}
          >
            Browse learning center
          </Link>
        </div>
      </section>
    </div>
  );
}
