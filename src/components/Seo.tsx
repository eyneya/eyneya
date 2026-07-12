import { Helmet } from 'react-helmet-async';
import { BUSINESS } from '../lib/constants';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  schema?: object | object[];
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'AccountingService'],
  name: BUSINESS.name,
  description:
    'Premium tax preparation, planning, advisory, and strategy services for individuals, self-employed professionals, and business owners.',
  url: 'https://www.eyneya.com',
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.state,
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'City', name: 'Kennesaw' },
    { '@type': 'City', name: 'Marietta' },
    { '@type': 'State', name: 'Georgia' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
  ],
  priceRange: '$$',
  serviceType: ['Tax Preparation', 'Tax Planning', 'Tax Advisory', 'Tax Strategy', 'Tax Compliance'],
};

export default function Seo({ title, description, path, schema }: SeoProps) {
  const fullTitle = title.includes(BUSINESS.name)
    ? title
    : `${title} | ${BUSINESS.name} — Kennesaw, GA Tax Advisor`;
  const url = `https://www.eyneya.com${path ?? ''}`;
  const schemas = [localBusinessSchema, ...(Array.isArray(schema) ? schema : schema ? [schema] : [])];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
