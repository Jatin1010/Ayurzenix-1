import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Ayurzenix – India’s #1 AI-Powered Digital Ayurveda Platform',
  description = 'Experience India’s first AI-powered digital Ayurveda platform. Get personalized wellness insights and natural treatment plans using AI health analysis.',
  keywords = 'Ayurzenix, AI Ayurveda, Digital Ayurveda, Online Dosha Analysis, Personalized Wellness, AI Health Analysis, Ayurvedic OS',
  image = 'https://ayurzenix.in/og-image.jpg',
  url: passedUrl,
  type = 'website',
  noindex = false,
}) => {
  const location = useLocation();
  const siteTitle = title.includes('Ayurzenix') ? title : `${title} | Ayurzenix`;
  
  // Robust canonical URL detection
  const resolvedUrl = passedUrl || location.pathname;
  let cleanPath = resolvedUrl;
  if (cleanPath !== '/' && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }
  
  const canonicalUrl = cleanPath.startsWith('http') 
    ? cleanPath 
    : `https://ayurzenix.in${cleanPath === '/' ? '' : cleanPath}`;

  // Structured Data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ayurzenix",
    "url": "https://ayurzenix.in",
    "logo": "https://ayurzenix.in/Logo.png",
    "sameAs": [
      "https://facebook.com/ayurzenix",
      "https://instagram.com/ayurzenix",
      "https://twitter.com/ayurzenix"
    ]
  };

  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": siteTitle,
    "description": description,
    "medicalAudience": "Patient",
    "aspect": "Health Analysis"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Ayurzenix AI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ayurzenix is an AI-powered Ayurvedic health platform that provides personalized analysis for digestion, stress, sleep, and overall wellness."
        }
      },
      {
        "@type": "Question",
        "name": "Is the AI health analysis free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Ayurzenix offers a free initial AI health analysis for all users to help them understand their body's patterns."
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(medicalSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
