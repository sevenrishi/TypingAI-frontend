import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { buildCanonical, resolveImage, resolveSeo, siteMeta } from './seoConfig';

export default function Seo() {
  const { pathname } = useLocation();
  const seo = resolveSeo(pathname);
  const title = seo.title || siteMeta.title;
  const description = seo.description || siteMeta.description;
  const canonicalUrl = buildCanonical(pathname);
  const siteUrl = buildCanonical('/');
  const imageUrl = resolveImage(seo.image);
  const robots = seo.robots || 'index,follow';
  const ogType = seo.ogType || 'website';

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteMeta.name,
      url: siteUrl,
      description: siteMeta.description,
      inLanguage: 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteMeta.name,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      url: canonicalUrl,
      description,
    },
  ];

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteMeta.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={siteMeta.locale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
