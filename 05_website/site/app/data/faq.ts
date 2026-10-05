// Questions buyers (and AI answer engines) ask. Answers are short, self-contained and only state facts the company has confirmed.
import { site } from './site'
export type QA = { q: string; a: string }
export const faqGroups: { title: string; items: QA[] }[] = [
  {
    title: 'About Fresca Premier Fresh',
    items: [
      { q: 'What is Fresca Premier Fresh?', a: 'Fresca Premier Fresh Ltd is a Kenyan fresh produce export company based in Nairobi. We grow, source, pack and export premium vegetables, including French beans, snow peas, sugar snap peas and baby corn, to international markets.' },
      { q: 'Where is Fresca Premier Fresh located?', a: `We are based at ${site.address.street}, P.O. Box ${site.address.poBox}, ${site.address.city}, ${site.address.country}.` },
      { q: 'Who does Fresca Premier Fresh supply?', a: 'We supply wholesale importers, retailers and food-service companies in Europe and other international markets.' },
      { q: 'Do you grow your own produce?', a: 'We grow, source, pack and export fresh vegetables, working closely with trusted local farmers and with growers and packhouses that comply with internationally recognised standards.' },
    ],
  },
  {
    title: 'Products and packing',
    items: [
      { q: 'What products do you export?', a: 'Our core range is French beans (extra fine and fine), snow peas (mangetout), sugar snap peas and baby corn. We also supply avocados, mangoes, passion fruit, carrots, chillies, rosemary and chives.' },
      { q: 'How is your produce packed?', a: 'We pack to your customer’s specification, from export cartons to retail-ready punnets. Examples include cartons of 12 × 250 g for extra fine French beans and mangetout, and punnets of beans, peas, baby corn and chillies.' },
      { q: 'Can packing be customised?', a: 'Yes. We offer flexible packing according to customer specifications, using food-safe materials that protect quality and freshness.' },
      { q: 'What are your minimum order quantities and lead times?', a: 'These depend on the product, the season and the destination. Send us your requirements and we will confirm volumes and timing.' },
    ],
  },
  {
    title: 'Quality, safety and certification',
    items: [
      { q: 'Which certifications does Fresca Premier Fresh hold?', a: 'We hold GLOBALG.A.P. certification, together with KEPHIS (Kenya Plant Health Inspectorate Service) and AFA (Agriculture and Food Authority) credentials.' },
      { q: 'How do you ensure quality and food safety?', a: 'Every harvest is inspected and graded to meet international quality standards. We apply strict quality control with full traceability at every step of the supply chain, from the farm to final delivery.' },
      { q: 'Is your produce traceable?', a: 'Yes. We maintain full product traceability from the farm through grading and packing to delivery.' },
      { q: 'Do you support sustainable farming?', a: 'Yes. We work with local farmers and communities to promote sustainable agriculture, protect the environment and support responsible farming practices.' },
    ],
  },
  {
    title: 'Ordering and contact',
    items: [
      { q: 'How do I request a quote?', a: `Use the form on our contact page or email ${site.email} with the products, volumes, destination market and timing you need. We will reply with availability.` },
      { q: 'How can I contact Fresca Premier Fresh?', a: `Email ${site.email}, call ${site.phone}, or message us on WhatsApp on the same number. Our office is in ${site.address.city}, ${site.address.country}.` },
    ],
  },
]
export const allFaqs: QA[] = faqGroups.flatMap((g) => g.items)
