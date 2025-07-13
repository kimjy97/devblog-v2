import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/*.json$',
          '/*.xml$',
        ]
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
        ]
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
        ]
      }
    ],
    sitemap: `${domain}/sitemap.xml`,
    host: domain
  }
}