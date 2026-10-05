// Credentials, partner and client shown in the "Credentials & network" band.
// Facts come from the client (WhatsApp, Oct 2026). Do NOT add claims that are not confirmed.
export const certifications = [
  {
    key: 'globalgap', name: 'GLOBALG.A.P.', label: 'Certified',
    text: 'Internationally recognised standard for good agricultural practice and food safety.',
    // GLOBALG.A.P. rules: its logo may only be shown by certificate holders, for B2B use, together with the
    // company's GGN (or a link to its live certification status). Until the client supplies those, an icon badge is used, not the logo.
    ggn: '',            // e.g. '4056186012345' -> shown as "GGN 4056186012345"
    verifyUrl: '',      // link to the live status in the GLOBALG.A.P. database, if the client has one
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  },
  {
    key: 'kephis', name: 'KEPHIS', label: 'Plant health',
    text: 'Kenya Plant Health Inspectorate Service, the national plant health regulator.',
    icon: '<path d="M12 22V8M12 8c0-4 3-6 7-6 0 4-3 6-7 6zM12 13c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
  },
  {
    key: 'afa', name: 'AFA', label: 'Agriculture & food',
    text: 'Agriculture and Food Authority, Kenya’s regulator for the agriculture and food sector.',
    icon: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M9 13l2 2 4-4"/>',
  },
]

export const network = [
  { key: 'pvm', role: 'Partner', name: 'Premier Veg Mondo', logo: '/img/partners/premier-veg-mondo.webp', w: 512, h: 512, href: 'https://premierveg.com' },
  { key: 'mitro', role: 'Client', name: 'Mitrofresh', logo: '/img/partners/mitrofresh.svg', w: 1190, h: 1417 },
]
