// One place for per-page SEO: title, description, canonical, robots, social tags, breadcrumbs and the JSON-LD graph.
const CRUMB_NAMES: Record<string, string> = {
  about: 'About us', products: 'Products', quality: 'Quality & Safety', sustainability: 'Sustainability',
  team: 'Team', contact: 'Contact', privacy: 'Privacy Policy', accessibility: 'Accessibility', faq: 'FAQ',
}

export type SeoOptions = {
  title: string
  description: string
  /** use the title exactly as written (it already includes the brand) instead of adding " · Fresca Premier Fresh Ltd" */
  fullTitle?: boolean
  /** path under /public, e.g. '/img/factory/snow-peas-tray.webp' (default: the shared share image) */
  image?: string
  imageWidth?: number
  imageHeight?: number
  /** schema.org type of the page itself */
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'FAQPage'
  /** label for the last breadcrumb (e.g. the product name) */
  crumb?: string
  /** extra schema.org nodes for this page (Product, FAQPage, ItemList…) */
  nodes?: Record<string, unknown>[]
}

export function usePageSeo(o: SeoOptions) {
  const { siteUrl, preview } = useRuntimeConfig().public
  const root = String(siteUrl).replace(/\/$/, '')
  const route = useRoute()
  const path = route.path === '/' ? '/' : route.path.replace(/\/?$/, '/')
  const url = root + path
  const title = o.fullTitle ? o.title : `${o.title} · Fresca Premier Fresh Ltd`
  const image = root + (o.image || '/og.jpg')
  const isHome = path === '/'

  // breadcrumbs: Home > Section > Page
  const segs = path.split('/').filter(Boolean)
  const crumbs = isHome ? [] : [{ name: 'Home', path: '/' }, ...segs.map((s, i) => ({ name: i === segs.length - 1 && o.crumb ? o.crumb : CRUMB_NAMES[s] || s, path: '/' + segs.slice(0, i + 1).join('/') + '/' }))]
  useState<{ name: string; path: string }[]>('crumbs', () => []).value = crumbs

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
    ogImageWidth: o.imageWidth || 1200,
    ogImageHeight: o.imageHeight || 630,
    ogImageAlt: o.image ? o.title : 'Fresca Premier Fresh – fresh from Kenya to the world',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: o.description,
    twitterImage: image,
    robots: preview ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  })
  useHead({
    ...(o.fullTitle ? { titleTemplate: '%s' } : {}),
    link: [{ rel: 'canonical', href: url }],
    script: [{
      key: 'ld-graph',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          organizationNode(root),
          websiteNode(root),
          webPageNode({ root, url, type: o.type || 'WebPage', name: title, description: o.description, image, hasCrumbs: crumbs.length > 0 }),
          ...(crumbs.length ? [breadcrumbNode(root, url, crumbs)] : []),
          ...(o.nodes || []),
        ],
      }),
    }],
  })
}
