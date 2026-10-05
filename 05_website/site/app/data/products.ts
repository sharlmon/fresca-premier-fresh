// Single source of truth for products. Used by the home page cards and the Products page + expanded product view.
// Facts come from the company's own old website (Products and Packages pages). Do not add specs that are not confirmed.
export type Product = {
  slug: string
  name: string
  group: 'core' | 'range'
  category: 'Vegetable' | 'Fruit' | 'Herb'
  tag: string                       // short label shown on the card
  description: string
  facts: { label: string; value: string }[]
  photos: { src: string; alt: string }[]   // empty = no photo yet (a designed tile is shown instead)
}

export const products: Product[] = [
  {
    slug: 'french-beans', name: 'French Beans', group: 'core', category: 'Vegetable', tag: 'Extra fine & fine',
    description: 'Also known as haricot verts. Tender, slender pods, grown from seedlings and graded for consistency.',
    facts: [
      { label: 'Grades', value: 'Extra fine and fine' },
      { label: 'Packing', value: 'Retail punnets; export carton of 12 × 250 g (extra fine)' },
    ],
    photos: [
      { src: '/img/factory/french-beans-tray.webp', alt: 'Extra fine French beans packed in a black tray' },
      { src: '/img/factory/french-beans-bunch.webp', alt: 'A bunch of fresh French beans on a packing table' },
    ],
  },
  {
    slug: 'snow-peas', name: 'Snow Peas', group: 'core', category: 'Vegetable', tag: 'Mangetout',
    description: 'Flat, tender-podded peas with an excellent fibre content, sorted and packed for freshness.',
    facts: [
      { label: 'Also known as', value: 'Mangetout' },
      { label: 'Packing', value: 'Retail punnets; export carton of 12 × 250 g' },
    ],
    photos: [{ src: '/img/factory/snow-peas-tray.webp', alt: 'Snow peas (mangetout) packed in a black tray' }],
  },
  {
    slug: 'sugar-snap-peas', name: 'Sugar Snap Peas', group: 'core', category: 'Vegetable', tag: 'Crisp & sweet',
    description: 'Rounded, crunchy pods with a naturally sweet flavour and good fibre content.',
    facts: [{ label: 'Packing', value: 'Retail punnets' }],
    photos: [
      { src: '/img/factory/sugar-snaps-tray.webp', alt: 'Sugar snap peas packed in a black tray' },
      { src: '/img/factory/sugar-snaps-closeup.webp', alt: 'Close-up of sugar snap peas' },
    ],
  },
  {
    slug: 'baby-corn', name: 'Baby Corn', group: 'core', category: 'Vegetable', tag: 'Tray-packed',
    description: 'Tender baby corn, trimmed and packed in punnets ready for retail.',
    facts: [{ label: 'Packing', value: 'Retail punnets' }],
    photos: [{ src: '/img/baby-corn.webp', alt: 'Baby corn packed in black trays' }],
  },
  { slug: 'avocados', name: 'Avocados', group: 'range', category: 'Fruit', tag: 'Fruit', description: 'Creamy, oil-rich fruit with a rich, buttery flavour.', facts: [], photos: [{ src: '/img/products/avocado.webp', alt: 'Two avocados, one halved to show the stone' }] },
  { slug: 'mangoes', name: 'Mangoes', group: 'range', category: 'Fruit', tag: 'Fruit', description: 'Juicy, sweet fruit that is as good fresh as it is in desserts.', facts: [], photos: [{ src: '/img/products/mango.webp', alt: 'A ripe yellow mango' }] },
  { slug: 'passion-fruit', name: 'Passion Fruit', group: 'range', category: 'Fruit', tag: 'Fruit', description: 'Aromatic, tangy pulp that is a good source of vitamin C.', facts: [], photos: [{ src: '/img/products/passion-fruit.webp', alt: 'Passion fruit cut in half' }] },
  { slug: 'carrots', name: 'Carrots', group: 'range', category: 'Vegetable', tag: 'Vegetable', description: 'Crisp, naturally sweet roots rich in beta-carotene.', facts: [], photos: [{ src: '/img/products/carrots.webp', alt: 'Two fresh carrots' }] },
  {
    slug: 'chillies', name: 'Chillies', group: 'range', category: 'Vegetable', tag: 'Vegetable',
    description: 'Bird’s-eye chillies with a clean, fiery heat; a good source of vitamin C and B6.',
    facts: [{ label: 'Packing', value: 'Punnets of green, red, or red and green' }], photos: [{ src: '/img/products/chillies.webp', alt: 'A single red chilli' }],
  },
  { slug: 'rosemary', name: 'Rosemary', group: 'range', category: 'Herb', tag: 'Herb', description: 'A fragrant herb, prized in the kitchen for its aroma and flavour.', facts: [], photos: [{ src: '/img/products/rosemary.webp', alt: 'Fresh rosemary' }] },
  { slug: 'chives', name: 'Chives', group: 'range', category: 'Herb', tag: 'Herb', description: 'Mild, onion-flavoured herb for garnishing and flavouring.', facts: [], photos: [{ src: '/img/products/chives.webp', alt: 'A bundle of fresh chives' }] },
]

export const tones: Record<string, string> = {
  Fruit: 'from-sun-500 to-sun-400 text-forest',
  Vegetable: 'from-leaf-500 to-lime text-forest',
  Herb: 'from-leaf-700 to-leaf-400 text-white',
}
