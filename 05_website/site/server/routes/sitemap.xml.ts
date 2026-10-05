// Generated at build time (nuxt generate) -> /sitemap.xml  (every page, with images for product pages)
import { products } from '../../app/data/products'

const pages = [
  { path: '/', priority: '1.0', images: ['/og.jpg'] },
  { path: '/products/', priority: '0.9' },
  ...products.map((p) => ({ path: `/products/${p.slug}/`, priority: p.group === 'core' ? '0.8' : '0.6', images: p.photos.map((x) => x.src) })),
  { path: '/about/', priority: '0.7' },
  { path: '/quality/', priority: '0.7' },
  { path: '/sustainability/', priority: '0.6' },
  { path: '/team/', priority: '0.5' },
  { path: '/contact/', priority: '0.7' },
  { path: '/faq/', priority: '0.7' },
  { path: '/privacy/', priority: '0.3' },
  { path: '/accessibility/', priority: '0.3' },
]

export default defineEventHandler((event) => {
  const root = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
  const today = new Date().toISOString().slice(0, 10)
  const urls = pages
    .map((p) => `  <url>\n    <loc>${root}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${p.priority}</priority>${(p.images || []).map((i) => `\n    <image:image><image:loc>${root}${i}</image:loc></image:image>`).join('')}\n  </url>`)
    .join('\n')
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`
})
