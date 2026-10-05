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
  runtimeConfig: { public: { siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://frescapremierfresh.com', preview } },
  nitro: { prerender: { crawlLinks: true, routes: ['/', '/sitemap.xml', '/robots.txt', '/404.html'] } },
  app: {
    baseURL: base,
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Fresca Premier Fresh Ltd',
      link: [
        { rel: 'icon', href: base + 'img/logo.png' },
      ],
      script: [{
        innerHTML: "try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}try{var a=JSON.parse(localStorage.getItem('a11y')||'{}'),h=document.documentElement;if(a.size)h.classList.add('a11y-text-'+a.size);['spacing','font','contrast','links','still','cursor'].forEach(function(k){if(a[k])h.classList.add('a11y-'+k)});}catch(e){}",
        tagPosition: 'head',
      }],
      meta: [{ name: 'theme-color', content: '#072a1b' }, ...(preview ? [{ name: 'robots', content: 'noindex, nofollow' }] : [])],
    },
  },
})
