// Generated at build time -> /robots.txt. Preview builds ask search engines to stay away.
export default defineEventHandler((event) => {
  const { siteUrl, preview } = useRuntimeConfig(event).public
  const root = String(siteUrl).replace(/\/$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  if (preview) return 'User-agent: *\nDisallow: /\n'
  return `User-agent: *\nAllow: /\n\nSitemap: ${root}/sitemap.xml\n`
})
