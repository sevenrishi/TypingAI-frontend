import { jsPDF } from 'jspdf';

export interface CertificateData {
  id: string;
  issuedTo: string;
  courseName: string;
  issuedAt: string;
  lessonCount: number;
}

const DEFAULT_COURSE_NAME = 'TypingAI Complete Learning Path';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto).randomUUID().split('-')[0].toUpperCase();
  }
  return Math.random().toString(36).slice(2, 10).toUpperCase();
};

export const issueCertificate = (
  name?: string | null,
  lessonCount = 0,
  courseName = DEFAULT_COURSE_NAME,
  existing?: CertificateData | null
): CertificateData => {
  if (existing) return existing;
  const issuedTo = name?.trim() ? name.trim() : 'TypingAI Learner';
  return {
    id: generateId(),
    issuedTo,
    courseName,
    issuedAt: new Date().toISOString(),
    lessonCount
  };
};

export const formatCertificateDate = (issuedAt: string) => {
  if (!issuedAt) return '';
  const date = new Date(issuedAt);
  if (Number.isNaN(date.getTime())) return issuedAt;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getCertificateShareText = (certificate: CertificateData) =>
  `I completed the ${certificate.courseName} on TypingAI!`;

export const getCertificateShareLinks = (shareText: string, shareUrl: string) => {
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}${shareUrl ? `&url=${encodedUrl}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  };
};

export const getCertificateSvg = (certificate: CertificateData) => {
  const issuedTo = escapeXml(certificate.issuedTo);
  const courseName = escapeXml(certificate.courseName);
  const issuedAt = escapeXml(formatCertificateDate(certificate.issuedAt));
  const id = escapeXml(certificate.id);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1000" viewBox="0 0 1400 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="55%" stop-color="#0b1f32"/>
      <stop offset="100%" stop-color="#0f2a3d"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
  </defs>
  <rect width="1400" height="1000" rx="48" fill="url(#bg)"/>
  <rect x="40" y="40" width="1320" height="920" rx="40" fill="none" stroke="url(#accent)" stroke-width="4"/>
  <circle cx="170" cy="170" r="120" fill="#22d3ee" opacity="0.12"/>
  <circle cx="1220" cy="840" r="160" fill="#34d399" opacity="0.14"/>
  <rect x="120" y="140" width="1160" height="720" rx="32" fill="rgba(15, 23, 42, 0.45)" stroke="rgba(148, 163, 184, 0.25)" stroke-width="2"/>
  <text x="700" y="240" text-anchor="middle" font-family="Space Grotesk, Segoe UI, sans-serif" font-size="42" fill="#e2e8f0" letter-spacing="6">
    TYPINGAI ACADEMY
  </text>
  <text x="700" y="330" text-anchor="middle" font-family="Space Grotesk, Segoe UI, sans-serif" font-size="70" fill="#f8fafc">
    Certificate of Completion
  </text>
  <text x="700" y="410" text-anchor="middle" font-family="JetBrains Mono, ui-monospace, monospace" font-size="22" fill="#94a3b8" letter-spacing="2">
    This certifies that
  </text>
  <text x="700" y="500" text-anchor="middle" font-family="Space Grotesk, Segoe UI, sans-serif" font-size="60" fill="#38bdf8">
    ${issuedTo}
  </text>
  <text x="700" y="575" text-anchor="middle" font-family="JetBrains Mono, ui-monospace, monospace" font-size="22" fill="#94a3b8" letter-spacing="2">
    has successfully completed
  </text>
  <text x="700" y="650" text-anchor="middle" font-family="Space Grotesk, Segoe UI, sans-serif" font-size="44" fill="#e2e8f0">
    ${courseName}
  </text>
  <text x="260" y="780" text-anchor="start" font-family="JetBrains Mono, ui-monospace, monospace" font-size="18" fill="#94a3b8">
    Issued on ${issuedAt}
  </text>
  <text x="1140" y="780" text-anchor="end" font-family="JetBrains Mono, ui-monospace, monospace" font-size="18" fill="#94a3b8">
    Certificate ID ${id}
  </text>
  <rect x="220" y="820" width="960" height="6" fill="url(#accent)" rx="3"/>
</svg>`;
};

export const downloadCertificateSvg = (certificate: CertificateData, filename?: string) => {
  if (typeof document === 'undefined') return;
  const svg = getCertificateSvg(certificate);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename ?? `TypingAI-Certificate-${certificate.id}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const downloadCertificatePdf = async (certificate: CertificateData, filename?: string) => {
  if (typeof document === 'undefined') return;
  const svg = getCertificateSvg(certificate);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width || 1400;
    canvas.height = img.height || 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(url);
      return;
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pngData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width >= canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(pngData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename ?? `TypingAI-Certificate-${certificate.id}.pdf`);
    URL.revokeObjectURL(url);
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
  };
  img.src = url;
};

export const shareCertificate = async (
  certificate: CertificateData,
  shareUrl?: string
) => {
  if (typeof navigator === 'undefined' || !navigator.share) return false;
  const text = getCertificateShareText(certificate);
  const url =
    shareUrl ?? (typeof window !== 'undefined' ? window.location.origin : '');

  let file: File | null = null;
  if (typeof File !== 'undefined') {
    const svg = getCertificateSvg(certificate);
    file = new File([svg], `TypingAI-Certificate-${certificate.id}.svg`, {
      type: 'image/svg+xml'
    });
  }

  try {
    if (file && (navigator as Navigator & { canShare?: (data: ShareData) => boolean }).canShare?.({ files: [file] })) {
      await navigator.share({
        title: 'TypingAI Certificate',
        text,
        files: [file]
      });
      return true;
    }
    await navigator.share({ title: 'TypingAI Certificate', text, url });
    return true;
  } catch (error) {
    return false;
  }
};
