import React, { useDeferredValue, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import blogs, { BlogArticle, BlogArticleCategory } from '../data/blogs';
import { useTheme } from '../providers/ThemeProvider';
import { helpCenterFaqs } from '../seo/seoConfig';
import { RootState } from '../store';
import { showToast } from '../utils/toast';
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  Gauge,
  Keyboard,
  LifeBuoy,
  Mail,
  Minus,
  Search,
  Sparkles,
  Swords,
  Target,
  TrendingUp,
  Plus,
  X,
} from 'lucide-react';

type HelpCategory = 'All' | BlogArticleCategory;

const helpCategories: HelpCategory[] = [
  'All',
  'Beginner & Learning',
  'AI + Typing',
  'Typing Tests & Performance',
  'Multiplayer & Gamification',
  'Practice & Advanced',
  'Using TypingAI',
];

const categoryIcons = {
  'Beginner & Learning': BookOpen,
  'AI + Typing': Sparkles,
  'Typing Tests & Performance': Gauge,
  'Multiplayer & Gamification': Swords,
  'Practice & Advanced': Target,
  'Using TypingAI': Keyboard,
} as const;

const categoryDescriptions: Record<BlogArticleCategory, string> = {
  'Beginner & Learning': 'Foundations, touch typing, routines, and first milestones.',
  'AI + Typing': 'Adaptive drills, AI-generated tests, and smart feedback.',
  'Typing Tests & Performance': 'WPM, accuracy, exam prep, and result analysis.',
  'Multiplayer & Gamification': 'Typing races, battles, motivation, and competition.',
  'Practice & Advanced': 'High-WPM practice, advanced drills, and professional typing.',
  'Using TypingAI': 'Feature guides, smart lessons, and platform-specific workflows.',
};

const categorySearchSeeds: Record<BlogArticleCategory, string> = {
  'Beginner & Learning': 'beginner touch typing',
  'AI + Typing': 'ai typing practice',
  'Typing Tests & Performance': 'wpm and accuracy',
  'Multiplayer & Gamification': 'typing battles',
  'Practice & Advanced': 'advanced typing practice',
  'Using TypingAI': 'using typingai',
};

const ignoredSearchTerms = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'of',
  'to',
  'for',
  'in',
  'on',
  'at',
  'with',
  'by',
  'is',
  'are',
  'was',
  'were',
  'be',
  'do',
  'does',
  'did',
  'can',
  'how',
  'what',
  'why',
  'when',
  'where',
  'which',
  'i',
  'me',
  'my',
  'you',
  'your',
  'we',
  'our',
]);

const quickActions = [
  {
    label: 'Start a typing test',
    description: 'Benchmark WPM and accuracy with a fast session.',
    to: '/typing',
    icon: Keyboard,
  },
  {
    label: 'Practice typing',
    description: 'Create focused practice around weak keys and patterns.',
    to: '/practice',
    icon: Gauge,
  },
  {
    label: 'Open lessons',
    description: 'Improve touch typing with guided progression.',
    to: '/learn',
    icon: BookOpen,
  },
  {
    label: 'Battleground',
    description: 'Jump into multiplayer races and live typing competition.',
    to: '/battleground',
    icon: Swords,
  },
];

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const searchIndex = blogs.map((article) => ({
  article,
  searchText: normalizeSearchValue(
    [
      article.title,
      article.category,
      article.excerpt,
      article.readTime,
      ...article.keywords,
      ...article.sections.flatMap((section) => [
        section.heading,
        ...section.body,
        ...(section.bullets ?? []),
      ]),
    ].join(' ')
  ),
}));

function buildSearchTerms(normalizedQuery: string) {
  if (!normalizedQuery) {
    return [];
  }

  const rawTerms = normalizedQuery.split(' ').filter(Boolean);
  const meaningfulTerms = rawTerms.filter((term) => term.length > 2 && !ignoredSearchTerms.has(term));
  const fallbackTerms = rawTerms.filter((term) => term.length > 1);

  return Array.from(new Set(meaningfulTerms.length ? meaningfulTerms : fallbackTerms));
}

function getSearchScore(
  article: BlogArticle,
  searchText: string,
  normalizedQuery: string,
  terms: string[],
) {
  if (!normalizedQuery) {
    return 1;
  }

  const normalizedTitle = normalizeSearchValue(article.title);
  const normalizedCategory = normalizeSearchValue(article.category);
  const matchedTerms = terms.filter((term) => searchText.includes(term)).length;

  let score = 0;

  if (normalizedTitle === normalizedQuery) {
    score += 20;
  }

  if (normalizedTitle.startsWith(normalizedQuery)) {
    score += 14;
  } else if (normalizedTitle.includes(normalizedQuery)) {
    score += 8;
  }

  if (searchText.includes(normalizedQuery)) {
    score += 8;
  }

  if (normalizedCategory.includes(normalizedQuery)) {
    score += 4;
  }

  score += matchedTerms * 4;

  if (terms.length > 1 && matchedTerms >= Math.ceil(terms.length / 2)) {
    score += 5;
  }

  return score;
}

function getBestArticleMatch(query: string, category: HelpCategory) {
  const normalizedQuery = normalizeSearchValue(query);
  const searchTerms = buildSearchTerms(normalizedQuery);

  if (!normalizedQuery) {
    return undefined;
  }

  return searchIndex
    .map((entry, index) => {
      if (category !== 'All' && entry.article.category !== category) {
        return null;
      }

      const score = getSearchScore(entry.article, entry.searchText, normalizedQuery, searchTerms);

      if (score <= 0) {
        return null;
      }

      return {
        article: entry.article,
        score,
        index,
      };
    })
    .filter((entry): entry is { article: BlogArticle; score: number; index: number } => entry !== null)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.index - right.index;
    })[0]?.article;
}

export default function HelpCenterPage() {
  const { theme } = useTheme();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<HelpCategory>('All');
  const [openFaqQuestion, setOpenFaqQuestion] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeSearchValue(deferredQuery);
  const searchTerms = useMemo(() => buildSearchTerms(normalizedQuery), [normalizedQuery]);

  const filteredArticles = useMemo(() => (
    searchIndex
      .map((entry, index) => ({
        article: entry.article,
        index,
        score: getSearchScore(entry.article, entry.searchText, normalizedQuery, searchTerms),
      }))
      .filter(({ article, score }) => {
        if (activeCategory !== 'All' && article.category !== activeCategory) {
          return false;
        }

        return normalizedQuery ? score > 0 : true;
      })
      .sort((left, right) => {
        if (!normalizedQuery || right.score === left.score) {
          return left.index - right.index;
        }

        return right.score - left.score;
      })
      .map(({ article }) => article)
  ), [activeCategory, normalizedQuery, searchTerms]);

  const featuredArticles = normalizedQuery || activeCategory !== 'All'
    ? filteredArticles.slice(0, 4)
    : blogs.slice(0, 4);

  const visibleFaqs = useMemo(() => {
    if (!normalizedQuery) {
      return helpCenterFaqs.slice(0, 5);
    }

    return helpCenterFaqs
      .map((faq) => {
        const searchText = normalizeSearchValue(`${faq.question} ${faq.answer}`);
        const hits = searchTerms.filter((term) => searchText.includes(term)).length;
        return {
          faq,
          hits,
        };
      })
      .filter(({ hits }) => hits > 0)
      .sort((left, right) => right.hits - left.hits)
        .slice(0, 5)
      .map(({ faq }) => faq);
  }, [normalizedQuery, searchTerms]);

  const surface = isDark
    ? 'bg-slate-900/70 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/80 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100 backdrop-blur-md'
    : 'bg-white/60 border-slate-200/80 text-slate-900 backdrop-blur-md';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const accentText = isDark ? 'text-cyan-300' : 'text-sky-600';
  const secondaryAction = isDark
    ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700';
  const primaryAction = isDark
    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-900 shadow-[0_18px_40px_rgba(34,211,238,0.35)] hover:shadow-[0_22px_48px_rgba(34,211,238,0.45)]'
    : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] hover:shadow-[0_22px_48px_rgba(14,165,233,0.35)]';

  const heroLabel = activeCategory === 'All' ? 'All Topics' : activeCategory;
  const resultsLabel = `${filteredArticles.length} ${filteredArticles.length === 1 ? 'blog' : 'blogs'}`;

  const openBestMatch = (nextQuery: string) => {
    const match =
      getBestArticleMatch(nextQuery, activeCategory) ??
      (activeCategory !== 'All' ? getBestArticleMatch(nextQuery, 'All') : undefined);

    if (!match) {
      showToast({
        message: 'No matching help guide yet. Try a shorter phrase like WPM, touch typing, or password reset.',
        tone: 'info',
      });
      return;
    }

    navigate(`/blog/${match.slug}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();
    if (!nextQuery) return;
    openBestMatch(nextQuery);
  };

  const clearSearch = () => {
    setQuery('');
    setActiveCategory('All');
  };

  return (
    <div className="space-y-10 pb-10">
      <section
        className={`relative overflow-hidden rounded-[32px] border p-6 sm:p-8 md:p-10 lg:p-14 ${
          isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="absolute inset-0">
          <div className={`absolute inset-0 ${isDark ? 'hero-grid-dark' : 'hero-grid-light'}`} />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        </div>

        <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6 animate-rise">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.35em] ${
                isDark
                  ? 'border-cyan-500/40 text-cyan-200 bg-slate-900/60'
                  : 'border-sky-200 text-sky-700 bg-sky-50'
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              HELP CENTER
            </div>
            <h1
              className="text-4xl md:text-6xl font-black leading-tight"
              style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
            >
              Search answers for all your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400">
                typing related queries in one place
              </span>
            </h1>
            <p className={`max-w-2xl text-lg ${mutedText}`}>
              Master your typing skills with comprehensive guides on speed improvement, technique mastery, accuracy training, multiplayer competitions, and advanced practice strategies. Search for specific topics, find instant solutions, and continue your typing journey.
            </p>

            <form onSubmit={handleSubmit} className={`rounded-[28px] border p-4 ${surface}`}>
              <div className="flex items-center gap-3 rounded-2xl border bg-white/90 px-4 py-3 text-slate-900 shadow-sm dark:bg-slate-900/80 dark:text-slate-100">
                <Search className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ask your question"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={`no-key inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${secondaryAction}`}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`text-xs uppercase tracking-[0.28em] ${mutedText}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {normalizedQuery ? 'Related searches' : 'Popular blog searches'}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {featuredArticles.map((article) => (
                  <button
                    key={article.slug}
                    type="button"
                    onClick={() => navigate(`/blog/${article.slug}`)}
                    className={`no-key rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${secondaryAction}`}
                  >
                    {article.title}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={`text-xs uppercase tracking-[0.28em] ${mutedText}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Topic shortcuts
                </span>
                {Object.entries(categorySearchSeeds).map(([category, seed]) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveCategory(category as BlogArticleCategory);
                      setQuery(seed);
                    }}
                    className={`no-key rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${secondaryAction}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="relative animate-rise animate-rise-delay-2">
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-cyan-400/20 via-sky-400/10 to-emerald-400/20 blur-3xl" />
            <div className={`relative rounded-[28px] border p-6 ${surface}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span
                    className={`text-[11px] uppercase tracking-[0.3em] ${mutedText}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Help cockpit
                  </span>
                </div>
                <span className={`text-xs uppercase tracking-[0.25em] ${accentText}`}>Typing-first</span>
              </div>

              <div className="mt-6 space-y-4">
                <div className={`rounded-2xl border p-4 ${surfaceSoft}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold">Support articles that lead to action</div>
                      <div className={`mt-2 text-sm ${mutedText}`}>Every blog points back to a live typing mode, learning path, or support flow.</div>
                    </div>
                    <TrendingUp className={`h-5 w-5 ${accentText}`} />
                  </div>
                </div>
                <div className={`rounded-2xl border p-4 ${surfaceSoft}`}>
                  <div
                    className={`text-[11px] uppercase tracking-[0.28em] ${mutedText}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Modern standards
                  </div>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className={mutedText}>Fast search</span>
                      <span className="font-semibold">Full-sentence queries</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={mutedText}>Skill Coverage</span>
                      <span className="font-semibold">Beginner to Advanced</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={mutedText}>Reading flow</span>
                      <span className="font-semibold">Related search chips</span>
                    </div>
                  </div>
                </div>
                <div className={`rounded-2xl border p-4 ${surfaceSoft}`}>
                  <div className="text-sm font-semibold">Need human help?</div>
                  <div className={`mt-2 text-sm ${mutedText}`}>
                    Email support at <span className="font-semibold text-inherit">support@typingai.live</span> with the account email and the step that failed.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <div
              className={`text-xs uppercase tracking-[0.35em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Quick access
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
            >
              Core routes for the typing platform
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${surface}`}
              >
                <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl ${isDark ? 'bg-cyan-400/10' : 'bg-sky-200/50'}`} />
                <div className="relative z-10">
                  <div
                    className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${
                      isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${accentText}`} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{item.label}</h3>
                  <p className={`mt-3 text-sm leading-7 ${mutedText}`}>{item.description}</p>
                  <div className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${accentText}`}>
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <div
              className={`text-xs uppercase tracking-[0.35em] ${mutedText}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Browse guides
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
            >
              Explore typing guides by category
            </h2>
          </div>

        </div>

        <div className="flex flex-wrap gap-3">
          {helpCategories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`no-key rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  isActive ? primaryAction : secondaryAction
                }`}
              >
                {category}
              </button>
            );
          })}
          {(query.trim() || activeCategory !== 'All') ? (
            <button
              type="button"
              onClick={clearSearch}
              className={`no-key rounded-full border px-4 py-2 text-sm font-semibold transition-all ${secondaryAction}`}
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {filteredArticles.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => {
              const Icon = categoryIcons[article.category];
              return (
                <Link
                  key={article.slug}
                  to={`/blog/${article.slug}`}
                  className={`group rounded-3xl border p-6 transition-all duration-300 ${surface}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div
                        className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {article.category}
                      </div>
                      <h3
                        className="mt-3 text-xl font-semibold"
                        style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
                      >
                        {article.title}
                      </h3>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-2xl border flex items-center justify-center ${
                        isDark ? 'bg-slate-900/70 border-slate-700' : 'bg-white border-slate-200'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${accentText}`} />
                    </div>
                  </div>

                  <p className={`mt-4 text-sm leading-7 ${mutedText}`}>{article.excerpt}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${surfaceSoft}`}>
                      {article.readTime}
                    </span>
                    <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${surfaceSoft}`}>
                      {categoryDescriptions[article.category]}
                    </span>
                  </div>

                  <div className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${accentText}`}>
                    Read guide
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={`rounded-3xl border p-8 text-center ${surface}`}>
            <CircleHelp className={`mx-auto h-8 w-8 ${accentText}`} />
            <h3 className="mt-4 text-2xl font-semibold">No matching guides yet</h3>
            <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
              Try a shorter phrase like "touch typing", "password reset", or "WPM accuracy", or press one of the topic filters to browse related help content.
            </p>
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className={`rounded-3xl border p-6 ${surface}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Frequently Asked Questions</h2>
            </div>
            <CircleHelp className={`h-6 w-6 ${accentText}`} />
          </div>
          <div className="mt-6 space-y-4">
            {visibleFaqs.map((faq) => {
              const isOpen = openFaqQuestion === faq.question;

              return (
                <div key={faq.question} className={`overflow-hidden rounded-2xl border ${surfaceSoft}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqQuestion(isOpen ? null : faq.question)}
                    className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left transition-colors duration-300 hover:bg-white/5"
                  >
                    <div className="space-y-1.5 pr-3">
                      <div className="text-sm font-semibold leading-6 md:text-base">{faq.question}</div>
                    </div>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        isOpen ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-200' : 'border-slate-600/70 bg-slate-950/40 text-slate-200'
                      }`}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </div>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-slate-700/40 px-5 py-4">
                      <p className={`text-sm leading-8 ${mutedText}`}>{faq.answer}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <section className={`rounded-3xl border p-6 ${surface}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className={`text-xs uppercase tracking-[0.3em] ${mutedText}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Support
                </div>
                <h2 className="mt-3 text-xl font-semibold">Need support from us?</h2>
                <p className={`mt-3 text-sm leading-7 ${mutedText}`}>
                  Can't find what you need? Reach out to our support team with your account email and details about the issue you encountered.
                </p>
              </div>
              <Mail className={`h-6 w-6 ${accentText}`} />
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className={`rounded-2xl border px-4 py-3 transition-colors duration-300 ${surfaceSoft}`}>
                <div className={`text-[11px] uppercase tracking-[0.28em] ${mutedText}`}>Email</div>
                <div className="mt-2 flex items-center gap-2 font-semibold">
                  <Mail className={`h-4 w-4 ${accentText}`} />
                  <span>support@typingai.live</span>
                </div>
              </div>
            </div>

            <a
              href="mailto:support@typingai.live"
              className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${primaryAction}`}
            >
              Email support
              <ArrowRight className="h-4 w-4" />
            </a>
          </section>

          <section className={`rounded-3xl border p-6 ${surface}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Related pages</h2>
                <p className={`mt-2 text-sm ${mutedText}`}>
                  Account recovery, privacy, and legal pages are still one click away.
                </p>
              </div>
              <LifeBuoy className={`h-6 w-6 ${accentText}`} />
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/reset-password"
                className={`inline-flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${secondaryAction}`}
              >
                Reset password
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/privacy"
                className={`inline-flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${secondaryAction}`}
              >
                Privacy policy
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/terms"
                className={`inline-flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${secondaryAction}`}
              >
                Terms of service
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
