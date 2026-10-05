// Generated at build time -> /llms.txt : a plain-text summary of the site for AI assistants (llmstxt.org format).
import { products } from '../../app/data/products'
import { site } from '../../app/data/site'
import { faqGroups } from '../../app/data/faq'

export default defineEventHandler((event) => {
  const { siteUrl, preview } = useRuntimeConfig(event).public
  const root = String(siteUrl).replace(/\/$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  if (preview) return '# Preview build: not for indexing\n'
  const a = site.address
  const lines = [
    `# ${site.legalName}`,
    '',
    `> ${site.description}`,
    '',
    '## Key facts',
    `- Company: ${site.legalName} (brand: ${site.name})`,
    `- Based in: ${a.street}, P.O. Box ${a.poBox}, ${a.city}, ${a.country}`,
    `- Contact: ${site.email} · ${site.phone} (also on WhatsApp)`,
    '- Core products: French beans (extra fine and fine), snow peas (mangetout), sugar snap peas, baby corn',
    '- Also supplied: avocados, mangoes, passion fruit, carrots, chillies, rosemary, chives',
    '- Customers: wholesale importers, retailers and food-service companies in Europe and other international markets',
    `- Certifications and credentials: GLOBALG.A.P. certification, KEPHIS, AFA`,
    '- Packing: export cartons (for example 12 × 250 g) and retail punnets, packed to customer specification',
    '- Quality: graded to international standards, full traceability from farm to delivery',
    '',
    '## Pages',
    `- [Home](${root}/): overview of the company and products`,
    `- [Products](${root}/products/): the full product range`,
    `- [About us](${root}/about/): company overview, vision and mission`,
    `- [Quality & Safety](${root}/quality/): food safety, traceability and certifications`,
    `- [Sustainability](${root}/sustainability/): farming and community commitments`,
    `- [FAQ](${root}/faq/): common questions with short answers`,
    `- [Contact](${root}/contact/): enquiry form, email, phone, address`,
    '',
    '## Products',
    ...products.map((p) => `- [${p.name}](${root}/products/${p.slug}/): ${p.description}`),
    '',
    '## Frequently asked questions',
    ...faqGroups.flatMap((g) => g.items.map((i) => `- ${i.q} ${i.a}`)),
    '',
  ]
  return lines.join('\n')
})
