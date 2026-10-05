// schema.org JSON-LD builders. Every page emits one connected @graph (Organization + WebSite + WebPage + breadcrumbs + page-specific nodes).
import { site } from '~/data/site'

export type Crumb = { name: string; path: string }

export const orgId = (root: string) => `${root}/#organization`
export const siteId = (root: string) => `${root}/#website`

export function organizationNode(root: string) {
  return {
    '@type': 'Organization',
    '@id': orgId(root),
    name: site.name,
    legalName: site.legalName,
    url: root + '/',
    slogan: site.slogan,
    description: site.description,
    logo: { '@type': 'ImageObject', '@id': root + '/#logo', url: root + '/img/logo.png', contentUrl: root + '/img/logo.png' },
    image: root + '/og.jpg',
    email: site.email,
    telephone: site.phoneRaw,
    knowsAbout: [...site.knowsAbout],
    knowsLanguage: 'en',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postOfficeBoxNumber: site.address.poBox,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'sales', telephone: site.phoneRaw, email: site.email, availableLanguage: 'English' },
    ],
    hasCertification: site.certifications.map((name) => ({ '@type': 'Certification', name })),
  }
}

export function websiteNode(root: string) {
  return {
    '@type': 'WebSite',
    '@id': siteId(root),
    url: root + '/',
    name: site.legalName,
    description: site.description,
    inLanguage: 'en',
    publisher: { '@id': orgId(root) },
  }
}

export function breadcrumbNode(root: string, url: string, crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': url + '#breadcrumb',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: root + c.path })),
  }
}

export function webPageNode(o: { root: string; url: string; type: string; name: string; description: string; image: string; hasCrumbs: boolean }) {
  return {
    '@type': o.type,
    '@id': o.url + '#webpage',
    url: o.url,
    name: o.name,
    description: o.description,
    inLanguage: 'en',
    isPartOf: { '@id': siteId(o.root) },
    about: { '@id': orgId(o.root) },
    primaryImageOfPage: { '@type': 'ImageObject', url: o.image },
    ...(o.hasCrumbs ? { breadcrumb: { '@id': o.url + '#breadcrumb' } } : {}),
  }
}

export function faqNode(url: string, items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': url + '#faq',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  }
}

export function productNode(o: { root: string; url: string; name: string; description: string; category: string; images: string[]; aka?: string; facts: { label: string; value: string }[] }) {
  return {
    '@type': 'Product',
    '@id': o.url + '#product',
    name: o.name,
    ...(o.aka ? { alternateName: o.aka } : {}),
    description: o.description,
    category: o.category,
    url: o.url,
    image: o.images,
    brand: { '@type': 'Brand', name: site.name },
    manufacturer: { '@id': orgId(o.root) },
    countryOfOrigin: { '@type': 'Country', name: 'Kenya' },
    additionalProperty: o.facts.map((f) => ({ '@type': 'PropertyValue', name: f.label, value: f.value })),
    mainEntityOfPage: { '@id': o.url + '#webpage' },
  }
}

export function itemListNode(url: string, name: string, items: { name: string; url: string }[]) {
  return {
    '@type': 'ItemList',
    '@id': url + '#list',
    name,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: it.url })),
  }
}
