// Single source of truth for products. Used by the home cards, the Products page, the expanded view and every /products/<slug>/ page.
// Facts come from the company's own website and the client. Do not add specs that are not confirmed.
export type Photo = { src: string; alt: string; aspect: number }   // aspect = width / height of the file
export type Product = {
  slug: string
  name: string
  aka?: string
  group: 'core' | 'range'
  category: 'Vegetable' | 'Fruit' | 'Herb'
  tag: string
  description: string
  seoTitle: string
  seoDesc: string
  intro: string[]
  highlights: string[]
  facts: { label: string; value: string }[]
  photos: Photo[]
}

const AVAIL = { label: 'Availability', value: 'Varies through the year; ask what is in season' }
const RANGE_HIGHLIGHTS = ['Sourced in Kenya for export', 'Packed to your specification', 'Strict quality control and full traceability']
const SEASON = 'Volumes and availability vary through the year, so tell us what you need and we will confirm what is in season for your market.'

export const products: Product[] = [
  {
    slug: 'french-beans', name: 'French Beans', aka: 'Haricot verts', group: 'core', category: 'Vegetable', tag: 'Extra fine & fine',
    description: 'Also known as haricot verts. Tender, slender pods, grown from seedlings and graded for consistency.',
    seoTitle: 'French Beans from Kenya · Extra Fine & Fine | Fresca',
    seoDesc: 'Premium extra fine and fine French beans (haricot verts) exported from Kenya, graded and packed to your specification. Request a quote from Fresca.',
    intro: ['French beans, also known as haricot verts, are slender, tender green beans that are popular with European retailers and food-service buyers.', 'Fresca Premier Fresh grows, sources and packs French beans in Kenya. They are graded as extra fine and fine, so each shipment matches the specification you order.'],
    highlights: ['Extra fine and fine grades', 'Retail punnets and export cartons of 12 × 250 g (extra fine)', 'Strict quality control and full traceability'],
    facts: [{ label: 'Grades', value: 'Extra fine and fine' }, { label: 'Packing', value: 'Retail punnets; export carton of 12 × 250 g (extra fine)' }],
    photos: [
      { src: '/img/factory/french-beans-tray.webp', alt: 'Extra fine French beans packed in a black tray', aspect: 0.75 },
      { src: '/img/factory/french-beans-bunch.webp', alt: 'A bunch of fresh French beans on a packing table', aspect: 0.75 },
    ],
  },
  {
    slug: 'snow-peas', name: 'Snow Peas', aka: 'Mangetout', group: 'core', category: 'Vegetable', tag: 'Mangetout',
    description: 'Flat, tender-podded peas with an excellent fibre content, sorted and packed for freshness.',
    seoTitle: 'Snow Peas (Mangetout) from Kenya | Fresca Premier Fresh',
    seoDesc: 'Flat, tender snow peas (mangetout) exported from Kenya, sorted and packed for freshness in export cartons or retail punnets. Request a quote from Fresca.',
    intro: ['Snow peas, known as mangetout (French for “eat all”), are flat, tender pods that are eaten whole and have an excellent fibre content.', 'We source and sort snow peas in Kenya and pack them in export cartons of 12 × 250 g or in retail punnets, ready for your market.'],
    highlights: ['Flat, tender pods with an excellent fibre content', 'Export cartons of 12 × 250 g and retail punnets', 'Sorted and packed for freshness'],
    facts: [{ label: 'Also known as', value: 'Mangetout' }, { label: 'Packing', value: 'Retail punnets; export carton of 12 × 250 g' }],
    photos: [{ src: '/img/factory/snow-peas-tray.webp', alt: 'Snow peas (mangetout) packed in a black tray', aspect: 0.75 }],
  },
  {
    slug: 'sugar-snap-peas', name: 'Sugar Snap Peas', group: 'core', category: 'Vegetable', tag: 'Crisp & sweet',
    description: 'Rounded, crunchy pods with a naturally sweet flavour and good fibre content.',
    seoTitle: 'Sugar Snap Peas from Kenya · Crisp & Sweet | Fresca',
    seoDesc: 'Crisp, sweet sugar snap peas exported from Kenya and packed to your specification in retail punnets. Request a quote from Fresca Premier Fresh Ltd, Nairobi.',
    intro: ['Sugar snap peas have rounded, crunchy pods with a naturally sweet flavour, and are eaten whole. They also offer good fibre content.', 'Fresca Premier Fresh grows and packs sugar snap peas in Kenya, graded for consistency and prepared for retail and food-service buyers.'],
    highlights: ['Rounded, crunchy pods with a sweet flavour', 'Retail punnets', 'Graded to international quality standards'],
    facts: [{ label: 'Packing', value: 'Retail punnets' }],
    photos: [
      { src: '/img/factory/sugar-snaps-tray.webp', alt: 'Sugar snap peas packed in a black tray', aspect: 0.75 },
      { src: '/img/factory/sugar-snaps-closeup.webp', alt: 'Close-up of sugar snap peas', aspect: 0.75 },
    ],
  },
  {
    slug: 'baby-corn', name: 'Baby Corn', group: 'core', category: 'Vegetable', tag: 'Tray-packed',
    description: 'Tender baby corn, trimmed and packed in punnets ready for retail.',
    seoTitle: 'Baby Corn from Kenya · Tray-Packed | Fresca Premier Fresh',
    seoDesc: 'Fresh, tender baby corn from Kenya, trimmed and packed in punnets ready for retail. Enquire about volumes with Fresca Premier Fresh Ltd, Nairobi.',
    intro: ['Baby corn is harvested young, before the ears mature, so the whole cob is tender enough to eat.', 'We trim and pack baby corn in Kenya in punnets that are ready for retail shelves.'],
    highlights: ['Tender whole cobs', 'Tray-packed retail punnets', 'Strict quality control and full traceability'],
    facts: [{ label: 'Packing', value: 'Retail punnets' }],
    photos: [{ src: '/img/baby-corn.webp', alt: 'Baby corn packed in black trays', aspect: 16 / 9 }],
  },
  {
    slug: 'avocados', name: 'Avocados', group: 'range', category: 'Fruit', tag: 'Fruit',
    description: 'Creamy, oil-rich fruit with a rich, buttery flavour.',
    seoTitle: 'Avocados from Kenya | Fresca Premier Fresh',
    seoDesc: 'Fresh avocados sourced in Kenya and exported by Fresca Premier Fresh Ltd. Volumes vary through the year, so ask us what is in season for your market.',
    intro: ['Avocados are creamy, oil-rich fruit with a rich, buttery flavour.', 'Fresca Premier Fresh sources avocados in Kenya for export. ' + SEASON],
    highlights: RANGE_HIGHLIGHTS, facts: [AVAIL],
    photos: [{ src: '/img/products/avocado.webp', alt: 'Two avocados, one halved to show the stone', aspect: 4 / 3 }],
  },
  {
    slug: 'mangoes', name: 'Mangoes', group: 'range', category: 'Fruit', tag: 'Fruit',
    description: 'Juicy, sweet fruit that is as good fresh as it is in desserts.',
    seoTitle: 'Mangoes from Kenya | Fresca Premier Fresh',
    seoDesc: 'Juicy, sweet mangoes sourced in Kenya and exported by Fresca Premier Fresh Ltd. Volumes vary through the year, so ask us what is in season.',
    intro: ['Mangoes are juicy, sweet fruit that are as good fresh as they are in desserts.', 'Fresca Premier Fresh sources mangoes in Kenya for export. ' + SEASON],
    highlights: RANGE_HIGHLIGHTS, facts: [AVAIL],
    photos: [{ src: '/img/products/mango.webp', alt: 'A ripe yellow mango', aspect: 4 / 3 }],
  },
  {
    slug: 'passion-fruit', name: 'Passion Fruit', group: 'range', category: 'Fruit', tag: 'Fruit',
    description: 'Aromatic, tangy pulp that is a good source of vitamin C.',
    seoTitle: 'Passion Fruit from Kenya | Fresca Premier Fresh',
    seoDesc: 'Aromatic passion fruit sourced in Kenya and exported by Fresca Premier Fresh Ltd. Volumes vary through the year, so ask us what is in season.',
    intro: ['Passion fruit has aromatic, tangy pulp and is a good source of vitamin C, riboflavin and potassium.', 'Fresca Premier Fresh sources passion fruit in Kenya for export. ' + SEASON],
    highlights: RANGE_HIGHLIGHTS, facts: [AVAIL],
    photos: [{ src: '/img/products/passion-fruit.webp', alt: 'Passion fruit cut in half', aspect: 4 / 3 }],
  },
  {
    slug: 'carrots', name: 'Carrots', group: 'range', category: 'Vegetable', tag: 'Vegetable',
    description: 'Crisp, naturally sweet roots rich in beta-carotene.',
    seoTitle: 'Carrots from Kenya | Fresca Premier Fresh',
    seoDesc: 'Crisp, naturally sweet carrots sourced in Kenya and exported by Fresca Premier Fresh Ltd. Ask us about volumes and what is in season.',
    intro: ['Carrots are crisp, naturally sweet roots that are rich in beta-carotene.', 'Fresca Premier Fresh sources carrots in Kenya for export. ' + SEASON],
    highlights: RANGE_HIGHLIGHTS, facts: [AVAIL],
    photos: [{ src: '/img/products/carrots.webp', alt: 'Two fresh carrots', aspect: 4 / 3 }],
  },
  {
    slug: 'chillies', name: 'Chillies', aka: 'Bird’s-eye chillies', group: 'range', category: 'Vegetable', tag: 'Vegetable',
    description: 'Bird’s-eye chillies with a clean, fiery heat; a good source of vitamin C and B6.',
    seoTitle: 'Chillies from Kenya · Green & Red Punnets | Fresca',
    seoDesc: 'Bird’s-eye chillies from Kenya in punnets of green, red, or red and green. Exported by Fresca Premier Fresh Ltd. Ask us about volumes and availability.',
    intro: ['Bird’s-eye chillies bring a clean, fiery heat and are a good source of vitamin C and vitamin B6.', 'We supply chillies in punnets of green, red, or red and green. ' + SEASON],
    highlights: ['Punnets of green, red, or red and green', 'Packed to your specification', 'Strict quality control and full traceability'],
    facts: [{ label: 'Packing', value: 'Punnets of green, red, or red and green' }, AVAIL],
    photos: [{ src: '/img/products/chillies.webp', alt: 'A single red chilli', aspect: 4 / 3 }],
  },
  {
    slug: 'rosemary', name: 'Rosemary', group: 'range', category: 'Herb', tag: 'Herb',
    description: 'A fragrant herb, prized in the kitchen for its aroma and flavour.',
    seoTitle: 'Fresh Rosemary from Kenya | Fresca Premier Fresh',
    seoDesc: 'Fragrant fresh rosemary sourced in Kenya and exported by Fresca Premier Fresh Ltd. Volumes vary through the year, so ask us what is in season.',
    intro: ['Rosemary is a fragrant herb, prized in the kitchen for its aroma and flavour.', 'Fresca Premier Fresh sources fresh rosemary in Kenya for export. ' + SEASON],
    highlights: RANGE_HIGHLIGHTS, facts: [AVAIL],
    photos: [{ src: '/img/products/rosemary.webp', alt: 'Fresh rosemary', aspect: 4 / 3 }],
  },
  {
    slug: 'chives', name: 'Chives', group: 'range', category: 'Herb', tag: 'Herb',
    description: 'Mild, onion-flavoured herb for garnishing and flavouring.',
    seoTitle: 'Fresh Chives from Kenya | Fresca Premier Fresh',
    seoDesc: 'Mild, onion-flavoured fresh chives sourced in Kenya and exported by Fresca Premier Fresh Ltd. Ask us about volumes and what is in season.',
    intro: ['Chives are a mild, onion-flavoured herb used for garnishing and flavouring.', 'Fresca Premier Fresh sources fresh chives in Kenya for export. ' + SEASON],
    highlights: RANGE_HIGHLIGHTS, facts: [AVAIL],
    photos: [{ src: '/img/products/chives.webp', alt: 'A bundle of fresh chives', aspect: 4 / 3 }],
  },
]

/** Questions shown on each product page (and in its FAQPage structured data). Only confirmed facts. */
export function productFaq(p: Product): { q: string; a: string }[] {
  const packing = p.facts.find((f) => f.label === 'Packing')
  const out = [
    { q: `Where does Fresca Premier Fresh supply ${p.name.toLowerCase()} from?`, a: `We source and export ${p.name.toLowerCase()} from Kenya to international markets. Our produce is carefully selected, graded, packed and prepared to meet the specifications of importers, retailers and food-service companies.` },
    { q: `How are ${p.name.toLowerCase()} packed?`, a: packing ? `${packing.value}. We can also pack to your customer’s specification, so tell us the format you need.` : `We pack to your customer’s specification, from export cartons to retail-ready punnets. Tell us the format you need and we will confirm what is possible for ${p.name.toLowerCase()}.` },
    { q: `Is ${p.name.toLowerCase()} traceable?`, a: 'Yes. We apply strict quality control and full traceability at every step of the supply chain, from the farm to final delivery.' },
    { q: `How do I request a quote for ${p.name.toLowerCase()}?`, a: 'Use the form on our contact page or email info@frescapremierfresh.com with the volumes, destination market and timing you need, and we will reply with availability.' },
  ]
  if (p.slug === 'french-beans') out.splice(1, 0, { q: 'What grades of French beans do you offer?', a: 'We grade French beans as extra fine and fine, so each shipment matches the specification you order.' })
  return out
}

export const tones: Record<string, string> = {
  Fruit: 'from-sun-500 to-sun-400 text-forest',
  Vegetable: 'from-leaf-500 to-lime text-forest',
  Herb: 'from-leaf-700 to-leaf-400 text-white',
}
