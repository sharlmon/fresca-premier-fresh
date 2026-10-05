// Generated at build time -> /robots.txt. Preview builds ask every crawler to stay away.
// Live site: search engines AND AI answer engines are welcome (being quoted in AI answers brings enquiries).
// To opt a crawler out, change its "Allow: /" to "Disallow: /".
export default defineEventHandler((event) => {
  const { siteUrl, preview } = useRuntimeConfig(event).public
  const root = String(siteUrl).replace(/\/$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  if (preview) return 'User-agent: *\nDisallow: /\n'
  const ai = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended']
  return [
    '# Fresca Premier Fresh Ltd',
    'User-agent: *',
    'Allow: /',
    '',
    '# AI search and answer engines',
    ...ai.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
    `Sitemap: ${root}/sitemap.xml`,
    '',
  ].join('\n')
})
