<script setup lang="ts">
useSeoMeta({
  title: 'Fresh from Kenya to the World',
  description: 'Fresca Premier Fresh Ltd exports premium Kenyan French beans, snow peas, sugar snaps and fresh vegetables to international markets. Quality, reliability, trust.',
})

const ic = (d: string) => d
const trust = [
  { t: '100% Fresh', i: '<path d="M12 22c4-4 6-8 6-12a6 6 0 0 0-12 0c0 4 2 8 6 12z"/><path d="M12 6v8"/>' },
  { t: 'Farm to Export', i: '<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
  { t: 'Fully Traceable', i: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>' },
  { t: 'Food Safe', i: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>' },
]
const pillars = [
  { t: 'Premium Quality', d: 'Carefully selected and graded vegetables that meet the highest international standards.', i: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>' },
  { t: 'Food Safety', d: 'Strict quality control and full traceability at every step of the supply chain.', i: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>' },
  { t: 'Reliable Supply', d: 'Consistent volumes, flexible solutions and on-time deliveries you can count on.', i: '<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>' },
  { t: 'Partnership Focused', d: 'Long-term relationships built on trust, integrity and exceptional service.', i: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' },
]
const products = [
  { t: 'French Beans', s: 'Extra fine & fine', img: '/img/stock/beans-dark.jpg' },
  { t: 'Snow Peas', s: 'Mangetout', img: '/img/stock/snow-peas-dew.jpg' },
  { t: 'Sugar Snap Peas', s: 'Crisp & sweet', img: '/img/stock/snap-pea-vine.jpg' },
  { t: 'Baby Corn', s: 'Fresh, tray-packed', img: '/img/baby-corn.jpg' },
]
const steps = [
  { t: 'Sourcing', d: 'We work closely with trusted farmers to source the finest produce at peak freshness.' },
  { t: 'Grading', d: 'Every harvest is inspected and graded to meet international quality standards.' },
  { t: 'Packing', d: 'Packed with care in food-safe materials to protect quality and freshness.' },
  { t: 'Delivery', d: 'Delivered on time and in perfect condition to markets across the world.' },
]
const stats = [['20+', 'International markets'], ['500+', 'Trusted farmers'], ['100%', 'Quality & food safety']]
const real = [
  { img: '/img/packhouse.jpg', cap: 'Grading at our packhouse' },
  { img: '/img/retail.jpg', cap: 'Retail-ready packs' },
  { img: '/img/truckload.jpg', cap: 'Cold-chain loading' },
]

const quote = reactive({ name: '', email: '', product: '' })
const sendQuote = () => navigateTo({ path: '/contact', query: { ...quote } })
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="relative mx-3 sm:mx-4 mt-3 overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] isolate">
      <img :src="$img('/img/stock/farmer.jpg')" alt="Farmer tending lush green crops" class="absolute inset-0 -z-20 h-full w-full object-cover" width="2000" height="1335" fetchpriority="high">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/30" />
      <div class="absolute inset-0 -z-10 vignette" />

      <div class="mx-auto max-w-6xl px-5 pt-16 pb-10 md:pt-24 grid lg:grid-cols-[1.15fr_.85fr] gap-12 items-center">
        <div class="reveal in">
          <p class="eyebrow">Premium Kenyan produce</p>
          <h1 class="mt-5 text-5xl sm:text-6xl lg:text-7xl leading-[1.02] text-white">
            Fresh from <span class="script text-leaf-300 text-[1.1em]">Kenya</span><br>to the world
          </h1>
          <p class="mt-6 text-lg text-white/80 max-w-lg">Premium-quality vegetables, responsibly grown and carefully delivered to international markets.</p>
          <div class="mt-9 flex flex-wrap gap-3">
            <NuxtLink to="/products" class="btn btn-sun">Our products →</NuxtLink>
            <NuxtLink to="/about" class="btn btn-glass glass">Our story</NuxtLink>
          </div>
        </div>

        <!-- glass quote card -->
        <form class="reveal in glass-strong rounded-[2rem] p-7 sm:p-9 lg:justify-self-end w-full max-w-md" @submit.prevent="sendQuote">
          <img :src="$img('/img/logo.png')" alt="" class="h-14 w-auto mx-auto rounded-2xl bg-white/90 p-1.5" width="70" height="56">
          <h2 class="mt-4 text-center text-3xl text-white">Request a quote</h2>
          <p class="mt-1 text-center text-sm text-white/70">Tell us what you need — we reply fast.</p>
          <div class="mt-6 grid gap-3">
            <input v-model="quote.name" class="field" type="text" placeholder="Your name / company" autocomplete="organization" aria-label="Your name or company">
            <input v-model="quote.email" class="field" type="email" placeholder="Email address" autocomplete="email" aria-label="Email address">
            <select v-model="quote.product" class="field" aria-label="Product of interest">
              <option value="">Product of interest</option>
              <option>French beans</option><option>Snow peas</option><option>Sugar snap peas</option><option>Baby corn</option><option>Other fresh vegetables</option>
            </select>
            <button type="submit" class="btn justify-center w-full text-white bg-gradient-to-b from-leaf-400 to-leaf-500 shadow-lg shadow-leaf-500/30 hover:brightness-110">Continue →</button>
          </div>
          <p class="mt-4 text-center text-xs text-white/55">Or email <a href="mailto:info@frescapremierfresh.com" class="text-leaf-300 hover:underline">info@frescapremierfresh.com</a></p>
        </form>
      </div>

      <ul class="mx-auto max-w-6xl px-5 pb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        <li v-for="t in trust" :key="t.t" class="glass rounded-2xl px-4 py-3.5 flex items-center gap-3">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="text-leaf-300 shrink-0" v-html="t.i" />
          <span class="text-sm font-semibold text-white">{{ t.t }}</span>
        </li>
      </ul>
    </section>

    <!-- STATS -->
    <section class="mx-auto max-w-6xl px-5 pt-14">
      <div class="reveal glass rounded-[2rem] grid grid-cols-3 divide-x divide-white/15 py-7 text-center">
        <div v-for="s in stats" :key="s[1]" class="px-2">
          <div class="font-display text-3xl sm:text-5xl bg-gradient-to-r from-leaf-300 to-sun-400 bg-clip-text text-transparent">{{ s[0] }}</div>
          <div class="mt-1 text-[11px] sm:text-sm font-semibold text-white/70">{{ s[1] }}</div>
        </div>
      </div>
    </section>

    <!-- WHY -->
    <section class="relative mt-20 isolate overflow-hidden">
      <img :src="$img('/img/stock/beans-noir.jpg')" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover opacity-80" width="1800" height="1200" loading="lazy">
      <div class="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/55 to-ink" />
      <div class="mx-auto max-w-6xl px-5 py-24">
        <div class="reveal">
          <p class="eyebrow">Why choose us</p>
          <h2 class="mt-3 text-4xl md:text-6xl text-white">Quality. Reliability. <span class="script text-leaf-300">Trust.</span></h2>
        </div>
        <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article v-for="(p, n) in pillars" :key="p.t" class="reveal glass-strong rounded-3xl p-7 hover:-translate-y-1.5 transition" :style="{ transitionDelay: n * 80 + 'ms' }">
            <span class="grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br from-leaf-400 to-leaf-700 text-white shadow-lg shadow-leaf-500/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="p.i" />
            </span>
            <h3 class="mt-5 text-2xl text-white">{{ p.t }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/75">{{ p.d }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- PRODUCTS -->
    <section class="mx-auto max-w-6xl px-5 py-24">
      <div class="reveal flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="eyebrow">What we grow</p>
          <h2 class="mt-3 text-4xl md:text-6xl text-white">Our <span class="script text-sun-400">products</span></h2>
        </div>
        <NuxtLink to="/products" class="glass rounded-full px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition">View all products →</NuxtLink>
      </div>
      <div class="mt-12 grid gap-5 grid-cols-2 lg:grid-cols-4">
        <NuxtLink v-for="(p, n) in products" :key="p.t" to="/products" class="reveal group relative overflow-hidden rounded-[2rem] aspect-[3/4] isolate" :style="{ transitionDelay: n * 80 + 'ms' }">
          <img :src="$img(p.img)" :alt="p.t" class="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-110" width="800" height="1000" loading="lazy">
          <div class="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <div class="glass-strong absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3.5">
            <h3 class="text-xl text-white leading-tight">{{ p.t }}</h3>
            <p class="text-xs font-semibold text-sun-400 mt-0.5">{{ p.s }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- PROCESS -->
    <section class="relative isolate overflow-hidden">
      <img :src="$img('/img/stock/crop-rows.jpg')" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" width="2000" height="1499" loading="lazy">
      <div class="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-forest/60 to-ink" />
      <div class="mx-auto max-w-6xl px-5 py-24">
        <div class="reveal">
          <p class="eyebrow">Our process</p>
          <h2 class="mt-3 text-4xl md:text-6xl text-white">From farm to <span class="script text-leaf-300">export</span></h2>
        </div>
        <ol class="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <li v-for="(s, i) in steps" :key="s.t" class="reveal glass-strong rounded-3xl p-6" :style="{ transitionDelay: i * 90 + 'ms' }">
            <span class="grid place-items-center h-12 w-12 rounded-full font-display text-2xl text-ink" :class="i % 2 ? 'bg-gradient-to-br from-leaf-300 to-leaf-400' : 'bg-gradient-to-br from-sun-400 to-sun-500'">{{ i + 1 }}</span>
            <h3 class="mt-5 text-2xl text-white">{{ s.t }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/80">{{ s.d }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- REAL OPERATIONS -->
    <section class="mx-auto max-w-6xl px-5 py-24">
      <div class="reveal">
        <p class="eyebrow">Behind the scenes</p>
        <h2 class="mt-3 text-4xl md:text-6xl text-white">Our <span class="script text-sun-400">operation</span>, up close</h2>
      </div>
      <div class="mt-12 grid gap-5 md:grid-cols-3">
        <figure v-for="(r, n) in real" :key="r.cap" class="reveal group relative overflow-hidden rounded-[2rem] aspect-[4/5] isolate" :style="{ transitionDelay: n * 80 + 'ms' }">
          <img :src="$img(r.img)" :alt="r.cap" class="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-105" width="960" height="1280" loading="lazy">
          <div class="absolute inset-0 -z-10 bg-gradient-to-t from-ink/70 to-transparent" />
          <figcaption class="glass absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white">{{ r.cap }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-auto max-w-6xl px-5 pb-8">
      <div class="reveal relative isolate overflow-hidden rounded-[2.5rem] text-center">
        <img :src="$img('/img/stock/farmer.jpg')" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" width="2000" height="1335" loading="lazy">
        <div class="absolute inset-0 -z-10 bg-gradient-to-br from-ink/90 to-leaf-700/60" />
        <div class="px-6 py-20">
          <div class="glass-strong mx-auto max-w-2xl rounded-[2rem] px-8 py-12">
            <h2 class="text-4xl md:text-6xl text-white">Let’s grow <span class="script text-leaf-300">together.</span></h2>
            <p class="mt-4 text-white/80">Tell us about your market requirements and we’ll respond quickly.</p>
            <NuxtLink to="/contact" class="btn btn-sun mt-8">Contact us →</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
