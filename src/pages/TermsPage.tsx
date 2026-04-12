import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../providers/ThemeProvider';
import { Ban, FileText, Gavel, Globe, Lock, Mail, Shield, Sparkles } from 'lucide-react';

const lastUpdated = 'April 13, 2026';

const highlights = [
  {
    title: 'Fair Use',
    description: 'Use TypingAI lawfully, respectfully, and only in ways that do not harm the service or other users.',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: 'Accounts',
    description: 'You are responsible for your account credentials, profile activity, and information you submit through the website.',
    icon: <Lock className="h-5 w-5" />,
  },
  {
    title: 'AI + Live Features',
    description: 'AI-generated passages and multiplayer rooms are provided to support practice, competition, and learning.',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: 'Service Limits',
    description: 'The platform is provided as available, may evolve over time, and can be suspended or changed when necessary.',
    icon: <Ban className="h-5 w-5" />,
  },
];

const sections = [
  {
    title: '1. Acceptance of These Terms',
    body: [
      'By accessing or using TypingAI, you agree to these Terms of Service. If you do not agree, you should not use the website.',
      'These terms apply to public visitors, registered users, and anyone who accesses TypingAI features including typing tests, practice sessions, learning tools, AI-generated passages, and multiplayer battleground rooms.',
    ],
  },
  {
    title: '2. Eligibility and Accounts',
    body: [
      'You are responsible for making sure your use of TypingAI is permitted under the laws that apply to you. If you create an account, you agree to provide accurate information and keep your credentials secure.',
      'You are responsible for activity that happens through your account. If you believe your account has been accessed without permission, contact us as soon as possible.',
      'Some features require registration, email activation, or Google sign-in before use.',
    ],
  },
  {
    title: '3. What TypingAI Provides',
    body: [
      'TypingAI offers typing tests, AI-assisted typing practice, guided learning tools, session tracking, profile statistics, certificates, and multiplayer race features.',
      'Some content, such as practice passages or battle scripts, may be generated through AI systems or prepared dynamically through the service.',
    ],
  },
  {
    title: '4. Acceptable Use',
    body: [
      'You agree not to misuse the website, interfere with normal operation, attempt unauthorized access, reverse engineer restricted parts of the service, scrape data in abusive ways, or use automated systems that overload the platform.',
      'You also agree not to use TypingAI to harass other users, impersonate another person, submit unlawful content, or attempt to disrupt multiplayer rooms, race flow, or scoring.',
      'If you participate in public or shared features, you are responsible for the names, text, or other inputs you choose to submit.',
    ],
  },
  {
    title: '5. AI-Generated and User-Submitted Content',
    body: [
      'TypingAI may generate text passages and practice material automatically. AI-generated output can be imperfect, repetitive, or unsuitable in some situations, so you should use your own judgment when relying on it.',
      'You retain responsibility for the prompts, topics, names, and other information you submit through the service. You represent that your submissions do not violate applicable law or the rights of others.',
    ],
  },
  {
    title: '6. Intellectual Property',
    body: [
      'TypingAI, including its interface, branding, visual design, software, and original site content, is owned by or licensed to the service operator and is protected by applicable intellectual property laws.',
      'These terms give you a limited, non-exclusive, revocable right to use the website for its intended personal or internal use. They do not transfer ownership of the platform or its underlying technology.',
    ],
  },
  {
    title: '7. Multiplayer, Community, and Fair Competition',
    body: [
      'If you use battleground or other live features, you agree to participate fairly and not manipulate race results, exploit bugs, falsify performance, or interfere with other players.',
      'TypingAI may remove room access, reset sessions, or restrict participation where abuse, cheating, or disruption is suspected.',
    ],
  },
  {
    title: '8. Suspension and Termination',
    body: [
      'TypingAI may suspend, restrict, or terminate access to all or part of the service if we reasonably believe you violated these terms, created risk for other users, or misused the platform.',
      'We may also modify, pause, or discontinue parts of the service, temporarily or permanently, including feature availability or account access requirements.',
    ],
  },
  {
    title: '9. Disclaimers',
    body: [
      'TypingAI is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted availability, error-free operation, perfect scoring, continuous uptime, or that AI-generated text will always be accurate or suitable.',
      'To the extent permitted by law, TypingAI disclaims warranties of merchantability, fitness for a particular purpose, non-infringement, and similar implied warranties.',
    ],
  },
  {
    title: '10. Limitation of Liability',
    body: [
      'To the extent permitted by law, TypingAI and its operators will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising out of or related to your use of the service.',
      'This includes loss of data, loss of access, service interruptions, competitive results, business interruption, or reliance on generated content. Where liability cannot be excluded by law, it will be limited to the minimum extent permitted.',
    ],
  },
  {
    title: '11. Changes to the Service or These Terms',
    body: [
      'We may update TypingAI and revise these terms from time to time. When we make material changes, we may update the effective date on this page and publish the revised version on the website.',
      'Continued use of TypingAI after updated terms become effective means you accept the revised terms.',
    ],
  },
  {
    title: '12. Contact',
    body: [
      'If you have questions about these Terms of Service, contact us at support@typingai.live.',
      'If you need information about how TypingAI handles personal data, please review the Privacy Policy as well.',
    ],
  },
];

export default function TermsPage() {
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
            <FileText className="h-3.5 w-3.5" />
            Terms of service
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
          >
            Terms for using TypingAI
          </h1>
          <p className={`max-w-3xl text-lg ${mutedText}`}>
            These terms explain the rules, responsibilities, disclaimers, and limits that apply when you use TypingAI and its typing, AI, and multiplayer features.
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
                  Key point
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
                  Important
                </div>
                <h2 className="mt-3 text-xl font-semibold">What to remember</h2>
              </div>
              <span className={accentText}>
                <Gavel className="h-6 w-6" />
              </span>
            </div>
            <ul className={`mt-5 space-y-3 text-sm ${mutedText}`}>
              <li className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>Do not misuse the platform or disrupt other users.</li>
              <li className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>You are responsible for your account and submitted content.</li>
              <li className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>AI-generated passages may be imperfect and are used at your own discretion.</li>
              <li className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>The service may change, pause, or remove features over time.</li>
            </ul>
          </section>

          <section className={`rounded-3xl border p-6 ${surface}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Related pages
                </div>
                <h2 className="mt-3 text-xl font-semibold">Legal and support links</h2>
              </div>
              <span className={accentText}>
                <Globe className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/privacy"
                className={`inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                Read privacy policy
              </Link>
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

          <section className={`rounded-3xl border p-6 ${surface}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Need clarification?</h2>
                <p className={`mt-2 text-sm ${mutedText}`}>
                  If you have questions about these terms, account restrictions, or legal page content, contact us directly.
                </p>
              </div>
              <span className={accentText}>
                <Mail className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-6">
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
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
