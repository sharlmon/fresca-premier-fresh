<script setup lang="ts">
useSeoMeta({
  title: 'Fresh from Kenya to the World',
  description: 'Fresca Premier Fresh Ltd exports premium Kenyan French beans, snow peas, sugar snaps and fresh vegetables to international markets. Quality, reliability, trust.',
})

const { $img } = useNuxtApp()

const slides = [
  { t: 'From the farm', s: 'Trusted growers, picked at peak freshness', img: '/img/stock/crop-rows.jpg' },
  { t: 'In our packhouse', s: 'Graded and packed to your specification', img: '/img/packhouse.jpg' },
  { t: 'Out to the world', s: 'Cold-chain delivery to international markets', img: '/img/truckload.jpg' },
]
const cur = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
const restart = () => { clearInterval(timer); timer = setInterval(() => (cur.value = (cur.value + 1) % slides.length), 4500) }
const go = (i: number) => { cur.value = i; restart() }
onMounted(restart)
onBeforeUnmount(() => clearInterval(timer))

const stats = [['20+', 'International markets'], ['500+', 'Trusted farmers'], ['100%', 'Quality & food safety']]
const products = [
  { t: 'French Beans', s: 'Extra fine & fine', img: '/img/stock/beans-dark.jpg' },
  { t: 'Snow Peas', s: 'Mangetout', img: '/img/stock/snow-peas-dew.jpg' },
  { t: 'Sugar Snap Peas', s: 'Crisp & sweet', img: '/img/stock/snap-pea-vine.jpg' },
  { t: 'Baby Corn', s: 'Fresh, tray-packed', img: '/img/baby-corn.jpg' },
]
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
  { img: '/img/packhouse2.jpg', cap: 'Grading line', cls: 'md:row-span-2' },
  { img: '/img/retail.jpg', cap: 'Retail-ready packs', cls: '' },
  { img: '/img/crates.jpg', cap: 'Crated for export', cls: '' },
]
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="relative isolate mx-3 sm:mx-4 mt-3 sm:mt-4 overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] min-h-[640px] h-[calc(100svh-1.5rem)] max-h-[900px] flex flex-col justify-end">
      <img :src="$img('/img/stock/bean-plant.jpg')" alt="Green bean plant with pods and orange flowers in daylight" class="absolute inset-0 -z-20 h-full w-full object-cover" width="2400" height="1600" fetchpriority="high">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-forest/62 via-forest/15 to-transparent" />
      <div class="absolute inset-0 -z-10 bg-gradient-to-t from-forest/45 via-transparent to-transparent" />

      <div class="mx-auto w-full max-w-6xl px-5 sm:px-8 pt-28 pb-10 sm:pb-14 grid lg:grid-cols-[1.3fr_.7fr] gap-10 items-end">
        <div class="reveal in">
          <span class="chip glass text-white"><i />Premium Kenyan produce</span>
          <h1 class="mt-5 text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.02] text-white">
            Fresh from Kenya<br><span class="serif font-normal">to the world.</span>
          </h1>
          <p class="mt-5 max-w-lg text-white/85 sm:text-lg">Premium-quality vegetables, responsibly grown and carefully delivered to international markets.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/contact" class="btn btn-lime">Request a quote <span class="arr">↗</span></NuxtLink>
            <NuxtLink to="/products" class="btn btn-white">Our products <span class="arr">↗</span></NuxtLink>
          </div>
        </div>

        <!-- glass carousel card -->
        <div class="reveal in glass rounded-[1.75rem] p-3 w-full max-w-sm lg:justify-self-end">
          <div class="relative overflow-hidden rounded-[1.25rem] aspect-[16/10]">
            <img v-for="(s, i) in slides" :key="s.t" :src="$img(s.img)" :alt="s.t" class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700" :class="i === cur ? 'opacity-100' : 'opacity-0'" width="640" height="400">
          </div>
          <div class="flex items-center justify-between gap-3 px-2 pt-3 pb-1 text-white">
            <div class="min-w-0">
              <p class="font-semibold text-sm">{{ slides[cur].t }}</p>
              <p class="text-xs text-white/75 truncate">{{ slides[cur].s }}</p>
            </div>
            <NuxtLink to="/about" class="grid place-items-center h-9 w-9 shrink-0 rounded-full bg-white text-forest hover:rotate-45 transition" aria-label="Learn more">↗</NuxtLink>
          </div>
          <div class="flex gap-1.5 px-2 pt-2 pb-1">
            <button v-for="(s, i) in slides" :key="s.t" class="h-1 flex-1 rounded-full transition" :class="i === cur ? 'bg-white' : 'bg-white/35'" :aria-label="'Slide ' + (i + 1)" @click="go(i)" />
          </div>
        </div>
      </div>
    </section>

    <!-- TRUST / STATS -->
    <section class="mx-auto max-w-6xl px-5 py-14 text-center">
      <p class="reveal text-sm font-semibold text-forest/70">Trusted by importers, retailers &amp; food-service companies across Europe</p>
      <div class="reveal mt-8 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div v-for="s in stats" :key="s[1]">
          <div class="text-4xl sm:text-6xl font-semibold text-forest tracking-tight">{{ s[0] }}</div>
          <div class="mt-1 text-xs sm:text-sm font-medium text-forest/60">{{ s[1] }}</div>
        </div>
      </div>
    </section>

    <!-- ABOUT / STORY -->
    <section class="mx-auto max-w-6xl px-5 pb-24">
      <span class="chip bg-pale text-leaf-700 reveal"><i />About us</span>
      <h2 class="reveal mt-6 text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.2] text-forest">
        Premium vegetables from Kenyan
        <span class="pillimg" :style="{ backgroundImage: `url(${$img('/img/stock/beans-dark.jpg')})` }" />
        farms, graded and packed for
        <span class="pillimg" :style="{ backgroundImage: `url(${$img('/img/truckload.jpg')})` }" />
        markets across the
        <span class="pillimg" :style="{ backgroundImage: `url(${$img('/img/stock/snow-peas-dew.jpg')})` }" />
        <span class="serif font-normal">world.</span>
      </h2>
      <div class="reveal mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end">
        <p class="max-w-2xl text-forest/70 leading-relaxed">Fresca Premier Fresh is a Kenyan fresh produce export company. We specialise in the production, sourcing, packing and export of vegetables that meet the highest international standards for quality, food safety and traceability.</p>
        <NuxtLink to="/about" class="btn btn-dark">Learn more about us <span class="arr">↗</span></NuxtLink>
      </div>
    </section>

    <!-- PRODUCTS -->
    <section class="bg-pale rounded-[2rem] sm:rounded-[3rem] mx-3 sm:mx-4">
      <div class="mx-auto max-w-6xl px-5 py-20">
        <div class="reveal flex flex-wrap items-end justify-between gap-5">
          <div>
            <span class="chip bg-white text-leaf-700"><i />What we grow</span>
            <h2 class="mt-5 text-4xl sm:text-6xl font-semibold text-forest">Our <span class="serif font-normal">products</span></h2>
          </div>
          <NuxtLink to="/products" class="btn btn-dark">View all products <span class="arr">↗</span></NuxtLink>
        </div>
        <div class="mt-12 grid gap-5 grid-cols-2 lg:grid-cols-4">
          <NuxtLink v-for="(p, n) in products" :key="p.t" to="/products" class="reveal group block" :style="{ transitionDelay: n * 80 + 'ms' }">
            <div class="overflow-hidden rounded-[1.75rem] aspect-[4/5] bg-white">
              <img :src="$img(p.img)" :alt="p.t" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" width="800" height="1000" loading="lazy">
            </div>
            <div class="mt-4 flex items-center justify-between gap-3 px-1">
              <div><h3 class="font-semibold text-forest">{{ p.t }}</h3><p class="text-sm text-forest/60">{{ p.s }}</p></div>
              <span class="grid place-items-center h-10 w-10 shrink-0 rounded-full bg-forest text-white group-hover:bg-lime group-hover:text-forest group-hover:rotate-45 transition">↗</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- WHY -->
    <section class="mx-auto max-w-6xl px-5 py-24 grid lg:grid-cols-[.9fr_1.1fr] gap-12">
      <div class="reveal">
        <span class="chip bg-pale text-leaf-700"><i />Why choose us</span>
        <h2 class="mt-5 text-4xl sm:text-6xl font-semibold leading-[1.05] text-forest">Quality. Reliability. <span class="serif font-normal">Trust.</span></h2>
        <p class="mt-6 text-forest/70 leading-relaxed max-w-md">Our products are carefully selected, graded, packed and prepared to meet the specifications of wholesale importers, retailers and food-service companies.</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <article v-for="(p, n) in pillars" :key="p.t" class="reveal rounded-[1.75rem] bg-mist border border-forest/5 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/5 transition" :style="{ transitionDelay: n * 80 + 'ms' }">
          <span class="grid place-items-center h-12 w-12 rounded-full bg-forest text-lime">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="p.i" />
          </span>
          <h3 class="mt-5 font-semibold text-lg text-forest">{{ p.t }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-forest/65">{{ p.d }}</p>
        </article>
      </div>
    </section>

    <!-- PROCESS -->
    <section class="relative isolate overflow-hidden mx-3 sm:mx-4 rounded-[2rem] sm:rounded-[3rem]">
      <img :src="$img('/img/stock/field-hills.jpg')" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" width="2000" height="1333" loading="lazy">
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
        <span class="chip bg-pale text-leaf-700"><i />Behind the scenes</span>
        <h2 class="mt-5 text-4xl sm:text-6xl font-semibold text-forest">Our operation, <span class="serif font-normal">up close</span></h2>
      </div>
      <div class="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2 md:h-[640px]">
        <figure v-for="(r, n) in real" :key="r.cap" class="reveal group relative overflow-hidden rounded-[1.75rem] aspect-[4/5] md:aspect-auto" :class="r.cls" :style="{ transitionDelay: n * 80 + 'ms' }">
          <img :src="$img(r.img)" :alt="r.cap" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" width="960" height="1280" loading="lazy">
          <figcaption class="glass absolute left-3 bottom-3 rounded-full px-4 py-2 text-sm font-semibold text-white">{{ r.cap }}</figcaption>
        </figure>
        <figure class="reveal relative overflow-hidden rounded-[1.75rem] aspect-[4/5] md:aspect-auto md:col-span-2 bg-forest flex items-center">
          <img :src="$img('/img/stock/beans-noir.jpg')" alt="" class="absolute inset-0 h-full w-full object-cover opacity-40" width="1800" height="1200" loading="lazy">
          <div class="relative p-8 sm:p-12 text-white">
            <p class="serif text-3xl sm:text-5xl leading-tight">“Quality is not an act,<br>it is a habit.”</p>
            <p class="mt-4 text-sm text-white/70">Every carton traced from farm to destination.</p>
          </div>
        </figure>
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-3 sm:mx-4 mb-3">
      <div class="reveal relative isolate overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-leaf-700">
        <img :src="$img('/img/stock/farmer.jpg')" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" width="2000" height="1335" loading="lazy">
        <div class="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/70 to-forest/20" />
        <div class="mx-auto max-w-6xl px-6 sm:px-10 py-20 sm:py-28 text-white">
          <h2 class="text-4xl sm:text-6xl font-semibold leading-[1.05] max-w-xl">Let’s grow <span class="serif font-normal">together.</span></h2>
          <p class="mt-5 max-w-md text-white/80">Tell us about your market requirements and we’ll respond quickly.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/contact" class="btn btn-lime">Request a quote <span class="arr">↗</span></NuxtLink>
            <a href="mailto:info@frescapremierfresh.com" class="btn btn-white">Email us <span class="arr">↗</span></a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
