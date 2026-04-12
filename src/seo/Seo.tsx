import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { buildCanonical, resolveImage, resolveSeo, siteMeta, uniqueKeywords } from './seoConfig';

export default function Seo() {
  const { pathname } = useLocation();
  const seo = resolveSeo(pathname);
  const title = seo.title || siteMeta.title;
  const description = seo.description || siteMeta.description;
  const canonicalUrl = buildCanonical(pathname);
  const siteUrl = buildCanonical('/');
  const imageUrl = resolveImage(seo.image);
  const robots = seo.robots || 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  const ogType = seo.ogType || 'website';
  const imageAlt = `${title}`;
  const keywords = uniqueKeywords([...(siteMeta.keywords || []), ...(seo.keywords || [])]);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteMeta.name,
      url: siteUrl,
      description: siteMeta.description,
      inLanguage: 'en',
      keywords: keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: siteMeta.name,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      url: canonicalUrl,
      description,
      image: imageUrl,
      keywords: keywords.join(', '),
      featureList: [
        'Typing tests with live WPM and accuracy feedback',
        'AI-powered typing practice drills',
        'Touch typing lessons and guided curriculum',
        'Multiplayer typing races and leaderboards',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': seo.schemaType || 'WebPage',
      name: title,
      url: canonicalUrl,
      description,
      inLanguage: 'en',
      keywords: keywords.join(', '),
      isPartOf: {
        '@type': 'WebSite',
        name: siteMeta.name,
        url: siteUrl,
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
      ...(seo.faqs?.length ? {
        mainEntity: seo.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      } : {}),
    },
  ];

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteMeta.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:locale" content={siteMeta.locale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
