<script setup lang="ts">
usePageSeo({
  title: 'Fresh from Kenya to the World',
  description: 'Fresca Premier Fresh Ltd exports premium Kenyan French beans, snow peas, sugar snaps and fresh vegetables to international markets. Quality, reliability, trust.',
})

import { products as allProducts } from '~/data/products'
const coreProducts = allProducts.filter((p) => p.group === 'core')
const { $img } = useNuxtApp()
useHead({ link: [{ rel: 'preload', as: 'image', href: $img('/img/hero/snow-peas.webp'), fetchpriority: 'high' }] })

// Hero slideshow. Photos are 2000px wide so they stay sharp full-bleed. Order: product first, then the farm.
const slides = [
  { img: '/img/hero/snow-peas.webp', macro: true, t: 'Snow peas', s: 'Mangetout, sorted and packed for freshness', alt: 'Snow peas packed in a tray', to: '/products/?p=snow-peas', pos: 'center 50%' },
  { img: '/img/hero/farmer.webp', t: 'From our growers', s: 'Trusted farmers, picked at peak freshness', alt: 'A farmer tending green crops in the field', to: '/about/', pos: 'center 38%' },
  { img: '/img/hero/french-beans.webp', macro: true, t: 'French beans', s: 'Extra fine and fine, graded for consistency', alt: 'Extra fine French beans packed in a tray', to: '/products/?p=french-beans', pos: 'center 50%' },
  { img: '/img/hero/field-hills.webp', macro: true, t: 'Grown in Kenya', s: 'Fertile fields, responsibly farmed', alt: 'Green crop fields below rolling hills', to: '/sustainability/', pos: 'center 55%' },
  { img: '/img/hero/sugar-snaps.webp', macro: true, t: 'Sugar snap peas', s: 'Crisp and sweet, packed to your specification', alt: 'Sugar snap peas packed in a tray', to: '/products/?p=sugar-snap-peas', pos: 'center 50%' },
]
const DWELL = 6500
const cur = ref(0)
const paused = ref(false)
const still = ref(false)                       // reduced motion / accessibility "pause animations"
let timer: ReturnType<typeof setTimeout> | undefined
const schedule = () => {
  clearTimeout(timer)
  if (paused.value || still.value) return
  timer = setTimeout(() => { cur.value = (cur.value + 1) % slides.length; schedule() }, DWELL)
}
const go = (i: number) => { cur.value = i; schedule() }
const toggle = () => { paused.value = !paused.value; schedule() }
let x0 = 0
const swipeStart = (e: TouchEvent) => { x0 = e.changedTouches[0].clientX }
const swipeEnd = (e: TouchEvent) => { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 60) go((cur.value + (dx < 0 ? 1 : slides.length - 1)) % slides.length) }
onMounted(() => {
  const root = document.documentElement
  const check = () => { still.value = root.classList.contains('a11y-still') || matchMedia('(prefers-reduced-motion: reduce)').matches; schedule() }
  check()
  new MutationObserver(check).observe(root, { attributes: true, attributeFilter: ['class'] })
  document.addEventListener('visibilitychange', () => (document.hidden ? clearTimeout(timer) : schedule()))
  // warm the remaining photos so the crossfade never shows a blank frame
  const warm = () => slides.slice(1).forEach((sl) => { const i = new Image(); i.src = $img(sl.img) })
  'requestIdleCallback' in window ? requestIdleCallback(warm) : setTimeout(warm, 1500)
})
onBeforeUnmount(() => clearTimeout(timer))

const stats = [['20+', 'International markets'], ['500+', 'Trusted farmers'], ['100%', 'Quality & food safety']]
const products = coreProducts.map((p) => ({ slug: p.slug, t: p.name, s: p.tag, img: p.photos[0].src, alt: p.photos[0].alt }))
const pillars = [
  { t: 'Premium Quality', d: 'Carefully selected and graded vegetables that meet the highest international standards.', i: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>' },
  { t: 'Food Safety', d: 'Strict quality control and full traceability at every step of the supply chain.', i: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>' },
  { t: 'Reliable Supply', d: 'Consistent volumes, flexible solutions and on-time deliveries you can count on.', i: '<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
  { t: 'Partnership Focused', d: 'Long-term relationships built on trust, integrity and exceptional service.', i: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' },
]
const steps = [
  { t: 'Sourcing', d: 'We work closely with trusted farmers to source the finest produce at peak freshness.' },
  { t: 'Grading', d: 'Every harvest is inspected and graded to meet international quality standards.' },
  { t: 'Packing', d: 'Packed with care in food-safe materials to protect quality and freshness.' },
  { t: 'Delivery', d: 'Delivered on time and in perfect condition to markets across the world.' },
]
const real = [
  { img: '/img/packhouse2.webp', cap: 'Grading line', cls: 'md:row-span-2' },
  { img: '/img/retail.webp', cap: 'Retail-ready packs', cls: '' },
  { img: '/img/crates.webp', cap: 'Crated for export', cls: '' },
]
</script>

<template>
  <div>
    <!-- HERO: full-bleed slideshow -->
    <section class="relative isolate mx-3 sm:mx-4 mt-3 sm:mt-4 overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] min-h-[640px] h-[calc(100svh-1.5rem)] max-h-[900px] flex flex-col justify-end bg-forest" role="group" aria-roledescription="carousel" aria-label="Fresca produce and farms" @touchstart.passive="swipeStart" @touchend.passive="swipeEnd">
      <div class="absolute inset-0 -z-20" aria-hidden="true">
        <img v-for="(sl, i) in slides" :key="sl.img" :src="$img(sl.img)" alt="" class="hero-slide absolute inset-0 h-full w-full object-cover" :class="{ 'is-active': i === cur }" :style="{ objectPosition: sl.pos }" width="2000" height="1125" :loading="i === 0 ? 'eager' : 'lazy'" :fetchpriority="i === 0 ? 'high' : 'auto'" decoding="async">
      </div>
      <!-- shade only where the text sits (bottom-left), so the photo stays bright elsewhere -->
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(95%_85%_at_0%_100%,rgba(7,42,27,.94)_0%,rgba(7,42,27,.72)_38%,rgba(7,42,27,.18)_72%,transparent_100%)] max-lg:bg-[linear-gradient(to_top,rgba(7,42,27,.96)_0%,rgba(7,42,27,.82)_42%,rgba(7,42,27,.2)_75%,rgba(7,42,27,.12)_100%)]" />
      <!-- product close-ups have bright, glossy highlights, so they get a stronger shade behind the text -->
      <div class="absolute inset-0 -z-10 transition-opacity duration-[1400ms] ease-in-out bg-[radial-gradient(130%_115%_at_0%_100%,rgba(7,42,27,.95)_0%,rgba(7,42,27,.86)_52%,rgba(7,42,27,.45)_82%,rgba(7,42,27,.12)_100%)] max-lg:bg-[linear-gradient(to_top,rgba(7,42,27,.97)_0%,rgba(7,42,27,.9)_55%,rgba(7,42,27,.5)_85%,rgba(7,42,27,.25)_100%)]" :class="slides[cur].macro ? 'opacity-100' : 'opacity-0'" />
      <div class="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-forest/35 to-transparent" />

      <div class="mx-auto w-full max-w-6xl px-5 sm:px-8 pt-28 pb-10 sm:pb-14 grid lg:grid-cols-[1.3fr_.7fr] gap-10 items-end">
        <div class="reveal in">
          <span class="chip glass text-white"><i />Premium Kenyan produce</span>
          <h1 class="mt-5 text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] text-white [text-shadow:0_2px_24px_rgba(4,23,15,.45)]">
            Fresh from Kenya<br><span class="serif font-normal">to the world.</span>
          </h1>
          <p class="mt-5 max-w-lg text-white sm:text-lg [text-shadow:0_1px_14px_rgba(4,23,15,.5)]">Premium-quality vegetables, responsibly grown and carefully delivered to international markets.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/contact" class="btn btn-lime">Request a quote <span class="arr">↗</span></NuxtLink>
            <NuxtLink to="/products" class="btn btn-white">Our products <span class="arr">↗</span></NuxtLink>
          </div>
        </div>

        <!-- slide caption + controls -->
        <div class="reveal in glass-plate rounded-[1.75rem] p-5 w-full max-w-sm lg:justify-self-end text-white">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0" :aria-live="paused || still ? 'polite' : 'off'" aria-atomic="true">
              <p class="text-[11px] font-bold uppercase tracking-[.2em] text-lime">Now showing</p>
              <p class="mt-1 text-xl font-semibold leading-tight">{{ slides[cur].t }}</p>
              <p class="mt-0.5 text-sm text-white/85">{{ slides[cur].s }}</p>
            </div>
            <NuxtLink :to="slides[cur].to" class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-forest transition hover:rotate-45" :aria-label="'View: ' + slides[cur].t">↗</NuxtLink>
          </div>
          <div class="mt-4 flex items-center gap-3">
            <button type="button" class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 transition hover:bg-white/35" :aria-label="paused ? 'Play slideshow' : 'Pause slideshow'" @click="toggle">
              <svg v-if="!(paused || still)" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1"/><rect x="14" y="4" width="5" height="16" rx="1"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>
            </button>
            <div class="flex flex-1 gap-2" role="group" aria-label="Choose slide">
              <button v-for="(sl, i) in slides" :key="sl.img" type="button" class="hero-bar relative h-2 flex-1 overflow-hidden rounded-full bg-white/30" :aria-label="'Show slide ' + (i + 1) + ' of ' + slides.length + ': ' + sl.t" :aria-current="i === cur ? 'true' : undefined" @click="go(i)">
                <span class="absolute inset-y-0 left-0 rounded-full bg-white" :class="i === cur ? (paused || still ? 'w-full' : 'hero-fill') : (i < cur ? 'w-full' : 'w-0')" :style="{ animationDuration: DWELL + 'ms', animationPlayState: paused ? 'paused' : 'running' }" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TRUST / STATS -->
    <section class="mx-auto max-w-6xl px-5 py-14 text-center">
      <p class="reveal text-sm font-semibold text-fg/70">Trusted by importers, retailers &amp; food-service companies across Europe</p>
      <div class="reveal mt-8 flex flex-wrap justify-center gap-x-8 gap-y-6 max-w-3xl mx-auto">
        <div v-for="s in stats" :key="s[1]" class="flex-1 basis-24">
          <div class="text-4xl sm:text-6xl font-semibold text-fg tracking-tight">{{ s[0] }}</div>
          <div class="mt-1 text-xs sm:text-sm font-medium text-fg/72">{{ s[1] }}</div>
        </div>
      </div>
    </section>

    <!-- ABOUT / STORY -->
    <section class="mx-auto max-w-6xl px-5 pb-24">
      <span class="chip chip-soft reveal"><i />About us</span>
      <h2 class="reveal mt-6 text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.2] text-fg">
        Premium vegetables from Kenyan
        <span class="pillimg" :style="{ backgroundImage: `url(${$img('/img/factory/french-beans-tray.webp')})` }" />
        farms, graded and packed for
        <span class="pillimg" :style="{ backgroundImage: `url(${$img('/img/truckload.webp')})` }" />
        markets across the
        <span class="pillimg" :style="{ backgroundImage: `url(${$img('/img/factory/snow-peas-tray.webp')})` }" />
        <span class="serif font-normal">world.</span>
      </h2>
      <div class="reveal mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end">
        <p class="max-w-2xl text-fg/70 leading-relaxed">Fresca Premier Fresh is a Kenyan fresh produce export company. We specialise in the production, sourcing, packing and export of vegetables that meet the highest international standards for quality, food safety and traceability.</p>
        <NuxtLink to="/about" class="btn btn-dark">Learn more about us <span class="arr">↗</span></NuxtLink>
      </div>
    </section>

    <DownloadCard />

    <!-- PRODUCTS -->
    <section class="bg-soft rounded-[2rem] sm:rounded-[3rem] mx-3 sm:mx-4">
      <div class="mx-auto max-w-6xl px-5 py-20">
        <div class="reveal flex flex-wrap items-end justify-between gap-5">
          <div>
            <span class="chip bg-surface text-accent"><i />What we grow</span>
            <h2 class="mt-5 text-4xl sm:text-6xl font-semibold text-fg">Our <span class="serif font-normal">products</span></h2>
          </div>
          <NuxtLink to="/products" class="btn btn-dark">View all products <span class="arr">↗</span></NuxtLink>
        </div>
        <div class="mt-12 grid gap-5 grid-cols-2 lg:grid-cols-4">
          <NuxtLink v-for="(p, n) in products" :key="p.t" :to="{ path: '/products/', query: { p: p.slug } }" class="reveal group block" :aria-label="'View ' + p.t" :style="{ transitionDelay: n * 80 + 'ms' }">
            <div class="overflow-hidden rounded-[1.75rem] aspect-[4/5] bg-surface">
              <img :src="$img(p.img)" :alt="p.alt" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" width="800" height="1000" loading="lazy">
            </div>
            <div class="mt-4 flex items-center justify-between gap-3 px-1">
              <div><h3 class="font-semibold text-fg">{{ p.t }}</h3><p class="text-sm text-fg/72">{{ p.s }}</p></div>
              <span class="grid place-items-center h-10 w-10 shrink-0 rounded-full bg-fg text-surface group-hover:bg-lime group-hover:text-forest group-hover:rotate-45 transition">↗</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- WHY -->
    <section class="mx-auto max-w-6xl px-5 py-24 grid lg:grid-cols-[.9fr_1.1fr] gap-12">
      <div class="reveal">
        <span class="chip chip-soft"><i />Why choose us</span>
        <h2 class="mt-5 text-4xl sm:text-6xl font-semibold leading-[1.05] text-fg">Quality. Reliability. <span class="serif font-normal">Trust.</span></h2>
        <p class="mt-6 text-fg/70 leading-relaxed max-w-md">Our products are carefully selected, graded, packed and prepared to meet the specifications of wholesale importers, retailers and food-service companies.</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <article v-for="(p, n) in pillars" :key="p.t" class="reveal rounded-[1.75rem] bg-card border border-fg/10 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/5 transition" :style="{ transitionDelay: n * 80 + 'ms' }">
          <span class="icon-circle h-12 w-12">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="p.i" />
          </span>
          <h3 class="mt-5 font-semibold text-lg text-fg">{{ p.t }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-fg/65">{{ p.d }}</p>
        </article>
      </div>
    </section>

    <!-- PROCESS -->
    <section class="relative isolate overflow-hidden mx-3 sm:mx-4 rounded-[2rem] sm:rounded-[3rem]">
      <img :src="$img('/img/stock/field-hills.webp')" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" width="2000" height="1333" loading="lazy">
      <div class="absolute inset-0 -z-10 bg-gradient-to-b from-forest/85 via-forest/70 to-forest/90" />
      <div class="mx-auto max-w-6xl px-5 py-20">
        <div class="reveal text-white">
          <span class="chip glass"><i />Our process</span>
          <h2 class="mt-5 text-4xl sm:text-6xl font-semibold">From farm to <span class="serif font-normal">export</span></h2>
        </div>
        <ol class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <li v-for="(s, i) in steps" :key="s.t" class="reveal glass rounded-[1.75rem] p-6 text-white" :style="{ transitionDelay: i * 90 + 'ms' }">
            <span class="grid place-items-center h-12 w-12 rounded-full bg-lime font-semibold text-forest">{{ i + 1 }}</span>
            <h3 class="mt-5 text-xl font-semibold">{{ s.t }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/80">{{ s.d }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- BEHIND THE SCENES -->
    <section class="mx-auto max-w-6xl px-5 py-24">
      <div class="reveal">
        <span class="chip chip-soft"><i />Behind the scenes</span>
        <h2 class="mt-5 text-4xl sm:text-6xl font-semibold text-fg">Our operation, <span class="serif font-normal">up close</span></h2>
      </div>
      <div class="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2 md:h-[640px]">
        <figure v-for="(r, n) in real" :key="r.cap" class="reveal group relative overflow-hidden rounded-[1.75rem] aspect-[4/5] md:aspect-auto" :class="r.cls" :style="{ transitionDelay: n * 80 + 'ms' }">
          <img :src="$img(r.img)" :alt="r.cap" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" width="960" height="1280" loading="lazy">
          <figcaption class="glass absolute left-3 bottom-3 rounded-full px-4 py-2 text-sm font-semibold text-white">{{ r.cap }}</figcaption>
        </figure>
        <figure class="reveal relative overflow-hidden rounded-[1.75rem] aspect-[4/5] md:aspect-auto md:col-span-2 bg-forest flex items-center">
          <img :src="$img('/img/factory/sugar-snaps-closeup.webp')" alt="" class="absolute inset-0 h-full w-full object-cover opacity-40" width="1800" height="1200" loading="lazy">
          <div class="relative p-8 sm:p-12 text-white">
            <p class="serif text-3xl sm:text-5xl leading-tight">Every carton, traced<br>from farm to destination.</p>
            <p class="mt-4 text-sm text-white/70">Strict quality control and full traceability at every step.</p>
          </div>
        </figure>
      </div>
    </section>

    <CtaBand />
  </div>
</template>
