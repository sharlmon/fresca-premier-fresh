<script setup lang="ts">
import { products, tones, type Product } from '~/data/products'

usePageSeo({
  title: 'Products',
  description: 'French beans, snow peas, sugar snap peas, baby corn and a wider range of fresh produce, packed to your specification and exported from Kenya.',
})
const { $img } = useNuxtApp()
const route = useRoute()
const router = useRouter()

const core = products.filter((p) => p.group === 'core')
const range = products.filter((p) => p.group === 'range')
const pack = [
  { t: 'Retail-ready punnets', s: 'Beans, peas, baby corn and more', img: '/img/retail.webp', alt: 'Packed green beans in retail punnets', pos: 'center 30%' },
  { t: 'Crated for the cold chain', s: 'Packed to your specification', img: '/img/crates.webp', alt: 'Crates of packed green beans', pos: 'center 40%' },
  { t: 'Loaded for export', s: 'Cartons stacked in a refrigerated truck', img: '/img/truckload.webp', alt: 'Cartons stacked inside a refrigerated truck', pos: 'center 55%' },
]

// ---- expanded product view: open from a click or from /products/?p=<slug> (shareable link) ----
const active = ref<string | null>(null)
let opener: HTMLElement | null = null
const idx = computed(() => products.findIndex((p) => p.slug === active.value))
const current = computed<Product | null>(() => (idx.value >= 0 ? products[idx.value] : null))

function open(p: Product, e?: Event) {
  if (e) opener = e.currentTarget as HTMLElement
  active.value = p.slug
  router.replace({ query: { ...route.query, p: p.slug } })
}
function close() {
  active.value = null
  const { p, ...rest } = route.query
  router.replace({ query: rest })
  nextTick(() => opener?.focus())
}
const step = (d: number) => {
  const n = (idx.value + d + products.length) % products.length
  active.value = products[n].slug
  router.replace({ query: { ...route.query, p: products[n].slug } })
}
// the URL is the source of truth: shared links and in-page clicks both go through ?p=<slug>
const valid = (v: unknown) => (products.some((p) => p.slug === v) ? String(v) : null)
watch(() => route.query.p, (v) => {
  const next = valid(v)
  const wasOpen = active.value !== null
  active.value = next
  if (!next && wasOpen) nextTick(() => opener?.focus())          // URL changed while open: return focus to the card
})
onMounted(() => {
  // a shared link (/products/?p=baby-corn) is read once the router is ready; during hydration the query is not available yet
  router.isReady().then(() => { const v = valid(route.query.p); if (v) active.value = v })
})
</script>

<template>
  <div>
    <PageHero eyebrow="What we grow" image="/img/factory/sugar-snaps-tray.webp" alt="Sugar snap peas packed in a tray" pos="center 45%" text="Premium vegetables, carefully selected, graded and packed for importers, retailers and food-service companies.">
      Fresh from <span class="serif font-normal">our farms.</span>
    </PageHero>

    <!-- core range -->
    <section class="mx-auto max-w-6xl px-5 py-24">
      <div class="reveal">
        <span class="chip chip-soft"><i />Core range</span>
        <h2 class="mt-5 text-4xl sm:text-6xl font-semibold">Our <span class="serif font-normal">specialities</span></h2>
        <p class="mt-4 text-fg/72">Select a product to see it in full.</p>
      </div>
      <div class="mt-12 grid gap-5 sm:grid-cols-2">
        <button v-for="(p, n) in core" :key="p.slug" type="button" class="reveal group relative isolate aspect-[4/3] overflow-hidden rounded-[2rem] text-left" :style="{ transitionDelay: n * 70 + 'ms' }" aria-haspopup="dialog" :aria-label="'View ' + p.name" @click="open(p, $event)">
          <img :src="$img(p.photos[0].src)" :alt="p.photos[0].alt" class="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-105" width="1200" height="900" loading="lazy">
          <div class="absolute inset-0 -z-10 bg-gradient-to-t from-forest/85 via-forest/25 to-transparent" />
          <span class="glass-plate absolute right-4 top-4 flex items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5 text-xs font-semibold text-white">View <span class="grid h-7 w-7 place-items-center rounded-full bg-lime text-forest transition group-hover:rotate-45" aria-hidden="true">↗</span></span>
          <span class="absolute inset-x-0 bottom-0 block p-6 text-white sm:p-8">
            <span class="chip glass">{{ p.tag }}</span>
            <span class="mt-3 block text-3xl font-semibold sm:text-4xl">{{ p.name }}</span>
            <span class="mt-2 block max-w-md text-sm leading-relaxed text-white/85">{{ p.description }}</span>
          </span>
        </button>
      </div>
    </section>

    <!-- wider range -->
    <section class="bg-soft rounded-[2rem] sm:rounded-[3rem] mx-3 sm:mx-4">
      <div class="mx-auto max-w-6xl px-5 py-20">
        <div class="reveal flex flex-wrap items-end justify-between gap-5">
          <div>
            <span class="chip bg-surface text-accent"><i />Also from Fresca</span>
            <h2 class="mt-5 text-4xl sm:text-6xl font-semibold">A wider <span class="serif font-normal">range</span></h2>
          </div>
          <p class="max-w-sm text-sm text-fg/70">Volumes and availability vary through the year. Ask us what is in season for your market.</p>
        </div>
        <div class="mt-12 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <button v-for="(p, n) in range" :key="p.slug" type="button" class="reveal group overflow-hidden rounded-[1.75rem] border border-fg/10 bg-surface text-left transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5" :style="{ transitionDelay: (n % 4) * 70 + 'ms' }" aria-haspopup="dialog" :aria-label="'View ' + p.name" @click="open(p, $event)">
            <span v-if="p.photos[0]" class="relative grid aspect-[4/3] place-items-center bg-card">
              <img :src="$img(p.photos[0].src)" :alt="p.photos[0].alt" class="max-h-[85%] w-auto object-contain transition duration-500 group-hover:scale-105" width="640" height="470" loading="lazy">
              <span class="absolute right-3 top-3 rounded-full bg-surface/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[.15em]">{{ p.category }}</span>
            </span>
            <span v-else class="relative flex items-end justify-between bg-gradient-to-br px-5 pb-4 pt-12" :class="tones[p.category]">
              <span class="serif text-6xl leading-none opacity-90" aria-hidden="true">{{ p.name[0] }}</span>
              <span class="rounded-full bg-white/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[.15em]">{{ p.category }}</span>
            </span>
            <span class="block p-5">
              <span class="flex items-center justify-between gap-2"><span class="text-lg font-semibold">{{ p.name }}</span><span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fg text-surface transition group-hover:rotate-45" aria-hidden="true">↗</span></span>
              <span class="mt-1 block text-sm leading-relaxed text-fg/72">{{ p.description }}</span>
            </span>
          </button>
          <NuxtLink to="/contact" class="reveal rounded-[1.75rem] bg-forest text-white p-6 flex flex-col justify-between min-h-[260px] hover:-translate-y-1 transition">
            <p class="serif text-2xl leading-snug">Looking for something specific?</p>
            <span class="btn btn-lime self-start">Ask us <span class="arr">↗</span></span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- packaging -->
    <section class="mx-auto max-w-6xl px-5 pt-24">
      <div class="reveal grid lg:grid-cols-[.9fr_1.1fr] gap-8 items-end">
        <div>
          <span class="chip chip-soft"><i />Packaging</span>
          <h2 class="mt-5 text-4xl sm:text-6xl font-semibold leading-[1.05]">Packed <span class="serif font-normal">your way.</span></h2>
        </div>
        <p class="text-fg/70 leading-relaxed">We pack to your customer’s specification, from export cartons to retail-ready punnets, using food-safe materials that protect quality and freshness on the way to market.</p>
      </div>
      <div class="mt-12 grid gap-5 md:grid-cols-3">
        <figure v-for="(p, n) in pack" :key="p.t" class="reveal" :style="{ transitionDelay: n * 80 + 'ms' }">
          <div class="overflow-hidden rounded-[1.75rem] aspect-[4/5] bg-card"><img :src="$img(p.img)" :alt="p.alt" class="h-full w-full object-cover" :style="{ objectPosition: p.pos }" width="960" height="1280" loading="lazy"></div>
          <figcaption class="mt-4 px-1"><span class="font-semibold">{{ p.t }}</span><span class="block text-sm text-fg/72">{{ p.s }}</span></figcaption>
        </figure>
      </div>
    </section>

    <DownloadCard />

    <CtaBand image="/img/stock/crop-rows.webp" />

    <ProductModal v-if="current" :product="current" :index="idx" :total="products.length" @close="close" @prev="step(-1)" @next="step(1)" />
  </div>
</template>
