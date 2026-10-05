import tailwindcss from '@tailwindcss/vite'

// Static site: `npm run generate` outputs plain files to .output/public
const base = process.env.NUXT_APP_BASE_URL || '/'
const preview = process.env.PREVIEW === '1'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  ssr: true,
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  nitro: { prerender: { crawlLinks: true, routes: ['/'] } },
  app: {
    baseURL: base,
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Fresca Premier Fresh Ltd',
      link: [
        { rel: 'icon', href: base + 'img/logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Kaushan+Script&family=Montserrat:wght@400;500;600;700&display=swap' },
      ],
      meta: [{ name: 'theme-color', content: '#072a1b' }, ...(preview ? [{ name: 'robots', content: 'noindex, nofollow' }] : [])],
    },
  },
})
