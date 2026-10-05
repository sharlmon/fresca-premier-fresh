<script setup lang="ts">
usePageSeo({
  title: 'Contact & Request a Quote · Fresca Premier Fresh',
  fullTitle: true,
  type: 'ContactPage',
  description: 'Contact Fresca Premier Fresh Ltd in Nairobi for enquiries, orders and quotes. Email info@frescapremierfresh.com or call +254 700 752 341.',
})
const map = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Trystar Go Down, Airport North Road, Nairobi, Kenya')
const { $img } = useNuxtApp()
const SITE = 'https://frescapremierfresh.com'
const people = [
  { n: 'Lucas Omollo', r: 'Director', slug: 'lucas', vcf: 'Lucas-Omollo.vcf' },
  { n: 'Judy Ogolla', r: 'Commercial & Operations Manager', slug: 'judy', vcf: 'Judy-Ogolla.vcf' },
]
const info = [
  { t: 'Email', v: 'info@frescapremierfresh.com', h: 'mailto:info@frescapremierfresh.com', i: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>' },
  { t: 'Phone', v: '+254 700 752 341', h: 'tel:+254700752341', i: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>' },
  { t: 'Visit', v: 'Trystar Go Down, Airport North Road, P.O. Box 3468-00200, Nairobi, Kenya', h: map, i: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>' },
]
</script>

<template>
  <div>
    <PageHero eyebrow="Contact us" image="/img/stock/crop-rows.webp" alt="Rows of green crops at golden hour" text="For enquiries, requests, orders and comments, we’re ready to talk. Your order ships as fast as it is processed.">
      Let’s <span class="serif font-normal">talk produce.</span>
    </PageHero>

    <section class="mx-auto max-w-6xl px-5 py-24 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[.85fr_1.15fr] gap-10 items-start">
      <div class="reveal grid grid-cols-[minmax(0,1fr)] gap-4">
        <a v-for="c in info" :key="c.t" :href="c.h" :target="c.t === 'Visit' ? '_blank' : undefined" rel="noopener" class="rounded-[1.75rem] bg-card border border-fg/10 p-6 flex gap-4 items-start hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition">
          <span class="icon-circle h-12 w-12 shrink-0"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="c.i" /></span>
          <span class="min-w-0"><span class="block text-xs font-bold uppercase tracking-[.2em] text-accent">{{ c.t }}</span><span class="mt-1 block font-semibold break-words [overflow-wrap:anywhere]">{{ c.v }}</span></span>
        </a>
        <div class="rounded-[1.75rem] bg-forest text-white p-6">
          <p class="text-xs font-bold uppercase tracking-[.2em] text-lime">Prefer a person?</p>
          <p class="mt-2 text-sm text-white/80 leading-relaxed">Reach our Director or Commercial &amp; Operations Manager directly.</p>
          <NuxtLink to="/team/" class="btn btn-lime mt-4">Meet the team <span class="arr">↗</span></NuxtLink>
        </div>
      </div>
      <div class="reveal"><ContactForm /></div>
    </section>

    <!-- save-a-contact QR -->
    <section class="bg-soft rounded-[2rem] sm:rounded-[3rem] mx-3 sm:mx-4 mb-24">
      <div class="mx-auto max-w-6xl px-5 py-20">
        <div class="reveal max-w-2xl">
          <span class="chip bg-surface text-accent">Save our contacts</span>
          <h2 class="mt-5 text-4xl sm:text-6xl font-semibold leading-[1.05]">Scan, save, <span class="serif font-normal">done.</span></h2>
          <p class="mt-4 text-fg/70 leading-relaxed">Point your phone camera at a code to open our digital business card. From there you can save the contact in one tap, call, email or WhatsApp.</p>
        </div>
        <div class="mt-12 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
          <article v-for="(p, n) in people" :key="p.slug" class="reveal rounded-[2rem] bg-forest text-white p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-center" :style="{ transitionDelay: n * 90 + 'ms' }">
            <div class="shrink-0 rounded-2xl bg-white p-3 w-40 h-40 sm:w-44 sm:h-44 mx-auto sm:mx-0 ring-4 ring-lime">
              <img :src="$img('/img/qr/' + p.slug + '.svg')" :alt="'QR code for ' + p.n + '\'s digital business card'" class="h-full w-full" width="176" height="176" loading="lazy">
            </div>
            <div class="min-w-0">
              <h3 class="text-2xl font-semibold">{{ p.n }}</h3>
              <p class="text-lime text-sm font-medium">{{ p.r }}</p>
              <div class="mt-5 flex flex-wrap gap-2">
                <a :href="SITE + '/card/' + p.slug + '/'" class="btn btn-lime">Open card <span class="arr">↗</span></a>
                <a :href="SITE + '/card/' + p.slug + '/' + p.vcf" class="btn btn-white">Save contact <span class="arr">↓</span></a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
