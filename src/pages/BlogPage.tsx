import React from 'react';
import { Link, useParams } from 'react-router-dom';
import blogs, { blogsBySlug } from '../data/blogs';
import { useTheme } from '../providers/ThemeProvider';
import { ArrowRight, BookOpen, Gauge, Keyboard, Sparkles, Swords, Target } from 'lucide-react';

const categoryIcons = {
  'Beginner & Learning': BookOpen,
  'AI + Typing': Sparkles,
  'Typing Tests & Performance': Gauge,
  'Multiplayer & Gamification': Swords,
  'Practice & Advanced': Target,
  'Using TypingAI': Keyboard,
} as const;

export default function BlogPage() {
  const { slug } = useParams();
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

  if (!slug) {
    return (
      <div className="app-shell py-8">
        <div className={`rounded-3xl border p-8 ${surface}`}>
          <h1 className="text-2xl font-bold">Missing article</h1>
          <p className={`mt-3 ${mutedText}`}>The help article link is incomplete.</p>
          <Link
            to="/help"
            className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold ${
              isDark
                ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900'
                : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white'
            }`}
          >
            Back
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const article = blogsBySlug[slug];

  if (!article) {
    return (
      <div className="app-shell py-8">
        <div className={`rounded-3xl border p-8 ${surface}`}>
          <h1 className="text-2xl font-bold">Article not found</h1>
          <p className={`mt-3 ${mutedText}`}>We could not find the help article you were looking for.</p>
          <Link
            to="/help"
            className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold ${
              isDark
                ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900'
                : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white'
            }`}
          >
            Back
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = blogs
    .filter((blog) => blog.slug !== article.slug)
    .map((blog, index) => {
      const sameCategoryScore = blog.category === article.category ? 10 : 0;
      const sharedKeywordScore = blog.keywords.filter((keyword) => article.keywords.includes(keyword)).length;
      return {
        blog,
        index,
        score: sameCategoryScore + sharedKeywordScore,
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.index - right.index;
    })
    .slice(0, 3)
    .map(({ blog }) => blog);
  const Icon = categoryIcons[article.category];

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
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.33fr]">
          <div className="space-y-4">
            <Link
              to="/help"
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${accentText}`}
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back
            </Link>

            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] ${
                isDark ? 'border-cyan-500/40 text-cyan-200 bg-slate-900/60' : 'border-sky-200 text-sky-700 bg-sky-50'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {article.category}
            </div>

            <h1
              className="text-3xl md:text-5xl font-bold"
              style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
            >
              {article.title}
            </h1>

            <p className={`max-w-3xl text-lg ${mutedText}`}>{article.excerpt}</p>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className={`rounded-2xl border px-4 py-3 ${surfaceSoft}`}>
                Read time: <span className="font-semibold">{article.readTime}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-[28px] border p-6 ${surface}`}>
            <div className="flex items-center justify-between">
              <div
                className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Quick route
              </div>
              <span className={accentText}>
                <Icon className="h-6 w-6" />
              </span>
            </div>
            <p className={`mt-4 text-sm leading-7 ${mutedText}`}>
              Use this guide as your next action plan, then jump straight back into TypingAI to apply it while the problem is fresh.
            </p>
            <Link
              to={article.cta.to}
              className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900 shadow-[0_18px_40px_rgba(34,211,238,0.35)]'
                  : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)]'
              }`}
            >
              {article.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.34fr]">
        <div className="space-y-6">
          {article.sections.map((section) => (
            <article key={section.heading} className={`rounded-3xl border p-6 ${surface}`}>
              <h2
                className="text-2xl font-semibold"
                style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
              >
                {section.heading}
              </h2>
              <div className={`mt-4 space-y-4 text-sm leading-7 ${mutedText}`}>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className={`mt-5 space-y-3 pl-5 text-sm leading-7 ${mutedText} list-disc marker:text-current`}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <section className={`rounded-3xl border p-6 ${surface}`}>
            <div
              className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Keywords
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.keywords.map((keyword) => (
                <span key={keyword} className={`rounded-full border px-3 py-2 text-xs font-semibold ${surfaceSoft}`}>
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          <section className={`rounded-3xl border p-6 ${surface}`}>
            <div
              className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Related guides
            </div>
            <div className="mt-4 space-y-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className={`block rounded-2xl border p-4 transition-all duration-300 ${surfaceSoft}`}
                >
                  <div className="text-sm font-semibold">{related.title}</div>
                  <div className={`mt-2 text-xs ${mutedText}`}>{related.category}</div>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
