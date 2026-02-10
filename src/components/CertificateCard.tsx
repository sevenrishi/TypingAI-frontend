import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { CertificateData, formatCertificateDate } from '../utils/certificates';

export default function CertificateCard({ certificate }: { certificate: CertificateData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const surface = isDark
    ? 'bg-slate-950/80 border-slate-700/60 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';
  const mutedText = isDark ? 'text-slate-300' : 'text-slate-600';
  const accentText = isDark ? 'text-cyan-300' : 'text-sky-600';

  return (
    <div className={`relative overflow-hidden rounded-3xl border ${surface}`}>
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute inset-6 rounded-[28px] border border-white/10" />
      </div>
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className={`text-xs uppercase tracking-[0.32em] ${mutedText}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            TypingAI Academy
          </div>
          <div className={`text-xs ${mutedText}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Certificate ID {certificate.id}
          </div>
        </div>
        <h3
          className="mt-4 text-2xl sm:text-3xl font-bold"
          style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
        >
          Certificate of Completion
        </h3>
        <p className={`mt-2 text-sm ${mutedText}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          This certifies that
        </p>
        <div className={`mt-3 text-2xl sm:text-3xl font-semibold ${accentText}`}>
          {certificate.issuedTo}
        </div>
        <p className={`mt-3 text-sm ${mutedText}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          has successfully completed
        </p>
        <div className="mt-3 text-lg sm:text-xl font-semibold">
          {certificate.courseName}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className={mutedText} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Issued {formatCertificateDate(certificate.issuedAt)}
          </div>
          <div className={mutedText} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            TypingAI Credential
          </div>
        </div>
        <div className="mt-5 h-1 w-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400" />
      </div>
    </div>
  );
}
