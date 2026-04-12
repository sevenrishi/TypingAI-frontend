import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../providers/ThemeProvider';
import { Database, Eye, Globe, Lock, Mail, Shield, Sparkles, Users } from 'lucide-react';

const lastUpdated = 'April 13, 2026';

const highlights = [
  {
    title: 'Account Data',
    description: 'Email address, display name, Google sign-in details, profile avatar, and account activation details.',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: 'Training Data',
    description: 'Typing sessions, WPM, CPM, accuracy, errors, test text, progress streaks, and learning records.',
    icon: <Database className="h-5 w-5" />,
  },
  {
    title: 'Usage Signals',
    description: 'Basic analytics, performance insights, and diagnostic information that help us improve the website.',
    icon: <Eye className="h-5 w-5" />,
  },
  {
    title: 'Live Features',
    description: 'Room names, player names, race progress, WPM, and accuracy while multiplayer typing rooms are active.',
    icon: <Users className="h-5 w-5" />,
  },
];

const sections = [
  {
    title: '1. Information We Collect',
    body: [
      'When you create an account, we may collect your email address, display name, password hash, avatar selection, and Google account identifiers if you sign in with Google.',
      'When you use typing tests, practice, learning tools, or battleground races, we store session information such as WPM, CPM, accuracy, errors, duration, difficulty or mode, session text, and battle results. We also store profile progress like streaks, completed lessons, certificates, and summary performance metrics.',
      'On your device, the website stores a sign-in token in browser local storage so you can stay signed in between visits.',
    ],
  },
  {
    title: '2. How We Use Information',
    body: [
      'We use your information to authenticate your account, personalize your training experience, save results, show progress history, power multiplayer rooms, and improve the reliability of the service.',
      'We also use contact details to send activation emails and password reset messages when you request them.',
      'If you use AI-generated typing content, the topic and generation settings you submit may be sent through our backend to an AI text generation provider to create practice passages.',
    ],
  },
  {
    title: '3. Analytics, Performance, and Logs',
    body: [
      'TypingAI uses Vercel Analytics and Vercel Speed Insights to understand general website usage and performance. These services may process technical usage information such as page views, browser context, and performance measurements.',
      'Our servers and infrastructure may also keep operational logs for security, debugging, and service maintenance.',
    ],
  },
  {
    title: '4. Multiplayer and Real-Time Features',
    body: [
      'TypingAI uses real-time socket connections for battleground rooms and race updates. During active multiplayer sessions, room state may include your chosen player name, progress, WPM, accuracy, ready state, and related race events.',
      'This information is used to run live matches and synchronize participants in real time.',
    ],
  },
  {
    title: '5. Third-Party Services',
    body: [
      'Depending on the feature you use, TypingAI may rely on third-party services such as Google OAuth for sign-in, Vercel for hosting and analytics, Groq-backed AI text generation, MongoDB for data storage, and SMTP or email delivery providers for account messages.',
      'These providers process information only as needed to support the related functionality.',
    ],
  },
  {
    title: '6. Cookies and Browser Storage',
    body: [
      'TypingAI primarily relies on browser storage rather than authentication cookies. A sign-in token may be stored in local storage so the website can restore your logged-in state.',
      'If you clear local storage or use private browsing, some saved state may be removed from your device.',
    ],
  },
  {
    title: '7. Data Sharing',
    body: [
      'We do not sell your personal information. We may share limited information with service providers that help us operate the website, deliver emails, provide analytics, generate AI practice content, or support infrastructure.',
      'We may also disclose information when required by law, to protect the service, or to investigate abuse or security incidents.',
    ],
  },
  {
    title: '8. Data Retention and Security',
    body: [
      'We keep account and training records for as long as they are needed to provide the service, maintain your profile history, comply with legal obligations, or resolve disputes.',
      'We use reasonable technical and organizational measures to protect stored information, but no internet service can guarantee absolute security.',
    ],
  },
  {
    title: '9. Your Choices',
    body: [
      'You can update parts of your profile inside the app, sign out at any time, or contact us if you want to ask about access, correction, or deletion of your information.',
      'If you do not want analytics or browser storage to operate normally, you can use browser privacy controls, content blockers, or clear stored site data.',
    ],
  },
  {
    title: '10. Children and Contact',
    body: [
      'TypingAI is not intended for children who are too young to consent under applicable law. If you believe a child has provided personal information inappropriately, contact us and we will review the request.',
      'For privacy questions or requests, contact us at support@typingai.live.',
    ],
  },
];

export default function PrivacyPage() {
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
        <div className="relative z-10 space-y-5">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] ${
              isDark ? 'border-cyan-500/40 text-cyan-200 bg-slate-900/60' : 'border-sky-200 text-sky-700 bg-sky-50'
            }`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <Lock className="h-3.5 w-3.5" />
            Privacy policy
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
          >
            Privacy information for TypingAI users
          </h1>
          <p className={`max-w-3xl text-lg ${mutedText}`}>
            This page explains what TypingAI collects, how the service uses it, what third-party services support the app, and what choices you have.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
              Last updated: <span className="font-semibold">{lastUpdated}</span>
            </div>
            <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
              Contact: <span className="font-semibold">support@typingai.live</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <div key={item.title} className={`rounded-3xl border p-6 ${surface}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Overview
                </div>
                <h2 className="mt-3 text-lg font-semibold">{item.title}</h2>
                <p className={`mt-3 text-sm ${mutedText}`}>{item.description}</p>
              </div>
              <div
                className={`h-11 w-11 rounded-2xl border flex items-center justify-center ${
                  isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <span className={accentText}>{item.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className={`rounded-3xl border p-6 ${surface}`}>
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
              >
                {section.title}
              </h2>
              <div className={`mt-4 space-y-3 text-sm leading-7 ${mutedText}`}>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="space-y-6">
          <section className={`rounded-3xl border p-6 ${surface}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Third parties
                </div>
                <h2 className="mt-3 text-xl font-semibold">Services that may process data</h2>
              </div>
              <span className={accentText}>
                <Globe className="h-6 w-6" />
              </span>
            </div>
            <ul className={`mt-5 space-y-3 text-sm ${mutedText}`}>
              <li className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>Google OAuth for sign-in</li>
              <li className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>Vercel for hosting, analytics, and speed insights</li>
              <li className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>Groq-backed AI text generation for typing passages</li>
              <li className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>MongoDB-backed storage for account and session data</li>
              <li className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>SMTP email delivery for activation and reset emails</li>
            </ul>
          </section>

          <section className={`rounded-3xl border p-6 ${surface}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Your controls
                </div>
                <h2 className="mt-3 text-xl font-semibold">What you can do</h2>
              </div>
              <span className={accentText}>
                <Sparkles className="h-6 w-6" />
              </span>
            </div>
            <div className={`mt-5 space-y-3 text-sm ${mutedText}`}>
              <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>Change account details and avatar inside your profile.</div>
              <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>Sign out to remove the saved auth token from the current browser.</div>
              <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>Clear browser storage if you want to remove locally saved sign-in state.</div>
              <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>Email support if you want to ask about privacy or data handling.</div>
            </div>
          </section>

          <section className={`rounded-3xl border p-6 ${surface}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Need help?</h2>
                <p className={`mt-2 text-sm ${mutedText}`}>
                  If you want clarification about this page or need support with your account, reach out anytime.
                </p>
              </div>
              <span className={accentText}>
                <Mail className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="mailto:support@typingai.live"
                className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900 shadow-[0_18px_40px_rgba(34,211,238,0.35)]'
                    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)]'
                }`}
              >
                Email support
              </a>
              <Link
                to="/help"
                className={`inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                Open help center
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
