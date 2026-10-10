import { MetadataRoute } from 'next'

// No sitemap URL is advertised: the deployment has no verified custom domain
// yet, and withdrawn curriculum routes must not be indexed from here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
  }
}