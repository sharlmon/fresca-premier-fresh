// Generated at build time (nuxt generate) -> /sitemap.xml
const pages = ['/', '/about/', '/products/', '/quality/', '/sustainability/', '/team/', '/contact/', '/privacy/', '/accessibility/']

export default defineEventHandler((event) => {
  const root = String(useRuntimeConfig(event).public.siteUrl).replace(/\/$/, '')
  const today = new Date().toISOString().slice(0, 10)
  const urls = pages
    .map((p) => `  <url><loc>${root}${p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`)
    .join('\n')
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
