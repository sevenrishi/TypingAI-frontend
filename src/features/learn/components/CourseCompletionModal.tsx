import React from 'react';
import { useTheme } from '../../../providers/ThemeProvider';
import { Facebook, Linkedin, Link, Share2, Sparkles, Trophy, Twitter, Download, X } from 'lucide-react';
import CertificateCard from '../../../components/CertificateCard';
import { CertificateData } from '../../../utils/certificates';

interface CourseCompletionModalProps {
  visible: boolean;
  certificate: CertificateData;
  shareLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  shareText: string;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
  onDownload: () => void;
  onClose: () => void;
}

const confettiColors = ['#22d3ee', '#38bdf8', '#34d399', '#fbbf24', '#f472b6'];

export default function CourseCompletionModal({
  visible,
  certificate,
  shareLinks,
  shareText,
  copied,
  onCopy,
  onShare,
  onDownload,
  onClose
}: CourseCompletionModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const surface = isDark
    ? 'bg-slate-900/80 border-slate-700/60 text-slate-100 backdrop-blur-xl'
    : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-xl';
  const surfaceSoft = isDark
    ? 'bg-slate-900/45 border-slate-700/50 text-slate-100'
    : 'bg-white/70 border-slate-200/80 text-slate-900';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-black/60' : 'bg-slate-900/20'
      }`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 22 }).map((_, index) => (
          <span
            key={index}
            className="absolute top-0 h-4 w-2 rounded-sm opacity-80"
            style={{
              left: `${(index * 5) % 100}%`,
              backgroundColor: confettiColors[index % confettiColors.length],
              animation: `confetti-fall ${3 + (index % 4)}s linear ${index * 0.15}s infinite`
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
      <div className={`relative w-full max-w-4xl mx-4 my-6 rounded-3xl border p-6 sm:p-8 ${surface}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-sky-400">
              <Trophy className="h-4 w-4" />
              Course Complete
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold">Congratulations!</h2>
            <p className={`mt-3 text-sm sm:text-base ${mutedText}`}>
              You finished the full TypingAI learning path. Celebrate the milestone and share your certificate.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <CertificateCard certificate={certificate} />
        </div>

        <div className={`mt-6 rounded-2xl border p-5 ${surfaceSoft}`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div
                className={`text-[10px] uppercase tracking-[0.3em] ${mutedText}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Share your achievement
              </div>
              <div className="mt-2 text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                Celebrate with your network
              </div>
              <p className={`mt-1 text-sm ${mutedText}`}>{shareText}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              <Twitter className="h-4 w-4" />
              X
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
            <button
              onClick={onCopy}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              <Link className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy text'}
            </button>
            <button
              onClick={onShare}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-emerald-400/60 hover:text-emerald-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={onDownload}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-emerald-400/60 hover:text-emerald-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
