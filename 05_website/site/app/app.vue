<script setup lang="ts">
import montserratUrl from '~/assets/fonts/montserrat-latin.woff2?url'
import serifUrl from '~/assets/fonts/dm-serif-display-latin.woff2?url'
import serifItalicUrl from '~/assets/fonts/dm-serif-display-italic-latin.woff2?url'
const root = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
useHead({
  link: [montserratUrl, serifUrl, serifItalicUrl].map((href) => ({ rel: 'preload', as: 'font', type: 'font/woff2', href, crossorigin: 'anonymous' })),
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Fresca Premier Fresh Ltd',
      alternateName: 'Fresca Premier Fresh',
      url: root + '/',
      logo: root + '/img/logo.png',
      image: root + '/og.jpg',
      description: 'Kenyan fresh produce exporter: French beans, snow peas, sugar snap peas, baby corn and fresh vegetables for international markets.',
      email: 'info@frescapremierfresh.com',
      telephone: '+254700752341',
      address: { '@type': 'PostalAddress', streetAddress: 'Trystar Go Down, Airport North Road, P.O. Box 3468-00200', addressLocality: 'Nairobi', addressCountry: 'KE' },
      contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', telephone: '+254700752341', email: 'info@frescapremierfresh.com' }],
    }),
  }],
})
// fade sections in as they scroll into view
onMounted(() => {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.12 })
  const scan = () => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
  scan()
  useRouter().afterEach(() => nextTick(scan))
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface text-fg">
    <a href="#main" class="skip-link">Skip to main content</a>
    <SiteHeader />
    <main id="main" tabindex="-1" class="flex-1 outline-none"><NuxtPage /></main>
    <SiteFooter />
    <aside aria-label="Accessibility and contact tools">
      <AccessibilityMenu />
      <WhatsAppButton />
    </aside>
  </div>
</template>
