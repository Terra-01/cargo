import type { MetadataRoute } from 'next';
import { tools } from '@/lib/tools';

// Kept in step with the tool registry automatically — a new shipped tool
// appears here with no extra edit. Mirrors the metadataBase logic in layout.tsx.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/about', '/notes'];

  const toolRoutes = tools
    .filter((tool) => tool.status === 'shipped')
    .map((tool) => tool.href);

  return [...staticRoutes, ...toolRoutes].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.8,
  }));
}
