// One source of truth for facts about the company (used by structured data, llms.txt, FAQ, footer).
export const site = {
  name: 'Fresca Premier Fresh',
  legalName: 'Fresca Premier Fresh Ltd',
  slogan: 'Fresh from Kenya to the world',
  email: 'info@frescapremierfresh.com',
  phone: '+254 700 752 341',
  phoneRaw: '+254700752341',
  address: {
    street: 'Trystar Go Down, Airport North Road',
    poBox: '3468-00200',
    city: 'Nairobi',
    postalCode: '00200',
    country: 'Kenya',
    countryCode: 'KE',
  },
  description:
    'Fresca Premier Fresh Ltd is a Kenyan fresh produce export company based in Nairobi. We grow, source, pack and export premium French beans, snow peas, sugar snap peas, baby corn and other fresh vegetables to importers, retailers and food-service companies in Europe and other international markets.',
  knowsAbout: ['French beans', 'Snow peas', 'Mangetout', 'Sugar snap peas', 'Baby corn', 'Fresh vegetables', 'Fresh produce export', 'Food safety and traceability'],
  certifications: ['GLOBALG.A.P.', 'KEPHIS', 'AFA'],
} as const
