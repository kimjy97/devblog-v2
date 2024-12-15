import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/',
        '/admin/',
        '/api/',
      ]
    },
    sitemap: `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`
  }
}