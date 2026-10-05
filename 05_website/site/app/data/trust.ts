// Certifications and partner shown in the "Credentials & partners" band.
// Facts come from the client (WhatsApp, Oct 2026). Do NOT add claims that are not confirmed.
export const certifications = [
  {
    key: 'globalgap', name: 'GLOBALG.A.P.', label: 'Certified',
    text: 'Internationally recognised standard for good agricultural practice and food safety.',
    // GLOBALG.A.P. rules: its logo may only be shown by certificate holders, for B2B use, together with the
    // company's GGN (or a link to its live certification status). Until the client supplies those, the name is shown as text, not the logo.
    ggn: '',            // e.g. '4056186012345' -> shown as "GGN 4056186012345"
    verifyUrl: '',      // link to the live status in the GLOBALG.A.P. database, if the client has one
  },
  {
    key: 'kephis', name: 'KEPHIS', label: 'Plant health',
    text: 'Kenya Plant Health Inspectorate Service, the national plant health regulator.',
  },
  {
    key: 'afa', name: 'AFA', label: 'Agriculture & food',
    text: 'Agriculture and Food Authority, Kenya’s regulator for the agriculture and food sector.',
  },
]

export const network = [
  { key: 'pvm', role: 'Partner', name: 'Premier Veg Mondo', logo: '/img/partners/premier-veg-mondo.webp', w: 512, h: 512, href: 'https://premierveg.com', blurb: 'Our sister company in the fresh-produce trade.' },
]
