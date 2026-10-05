// One place for per-page SEO: title, description, canonical URL and social-share tags.
export function usePageSeo(o: { title: string; description: string; image?: string }) {
  const { siteUrl } = useRuntimeConfig().public
  const root = String(siteUrl).replace(/\/$/, '')
  const route = useRoute()
  const path = route.path === '/' ? '/' : route.path.replace(/\/?$/, '/')
  const url = root + path
  const title = `${o.title} · Fresca Premier Fresh Ltd`
  const image = root + (o.image || '/og.jpg')
  useSeoMeta({
    title: o.title,
    description: o.description,
    ogTitle: title,
    ogDescription: o.description,
    ogUrl: url,
    ogType: 'website',
    ogSiteName: 'Fresca Premier Fresh Ltd',
    ogLocale: 'en_GB',
    ogImage: image,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: 'Fresca Premier Fresh – fresh from Kenya to the world',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: o.description,
    twitterImage: image,
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}
