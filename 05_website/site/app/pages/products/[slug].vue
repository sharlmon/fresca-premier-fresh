<script setup lang="ts">
import { products, productFaq } from '~/data/products'

const route = useRoute()
const { $img } = useNuxtApp()
const { siteUrl } = useRuntimeConfig().public
const root = String(siteUrl).replace(/\/$/, '')

const slug = String(route.params.slug)
const product = products.find((p) => p.slug === slug)
if (!product) throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })

const faq = productFaq(product)
const url = `${root}/products/${product.slug}/`
const photo = ref(0)
const current = computed(() => product.photos[photo.value])
const related = products.filter((p) => p.slug !== product.slug && (p.group === product.group || p.category === product.category)).slice(0, 3)
const idx = products.findIndex((p) => p.slug === product.slug)
const prev = products[(idx + products.length - 1) % products.length]
const next = products[(idx + 1) % products.length]

usePageSeo({
  title: product.seoTitle,
  fullTitle: true,
  description: product.seoDesc,
  image: product.photos[0].src,
  imageWidth: 1200,
  imageHeight: Math.round(1200 / product.photos[0].aspect),
  crumb: product.name,
  nodes: [
    productNode({ root, url, name: product.name, aka: product.aka, description: product.description + ' ' + product.intro.join(' '), category: product.category === 'Herb' ? 'Fresh herbs' : product.category === 'Fruit' ? 'Fresh fruit' : 'Fresh vegetables', images: product.photos.map((p) => root + p.src), facts: [...product.facts, { label: 'Country of origin', value: 'Kenya' }] }),
    faqNode(url, faq),
  ],
})
</script>

<template>
  <div>
    <!-- header panel: text on the left, the photo (not cropped) in a frame on the right -->
    <section class="relative isolate mx-3 sm:mx-4 mt-3 sm:mt-4 overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] bg-forest text-white">
      <img :src="$img(product.photos[0].src)" alt="" aria-hidden="true" class="absolute inset-0 -z-20 h-full w-full scale-110 object-cover opacity-60 blur-2xl saturate-150" width="1200" height="900" fetchpriority="high" decoding="async">
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(7,42,27,.94)_0%,rgba(7,42,27,.78)_50%,rgba(7,42,27,.45)_100%)]" />
      <div class="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-32 sm:px-8 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <Breadcrumbs class="mb-5" />
          <span class="chip glass">{{ product.category }} · from Kenya</span>
          <h1 class="mt-5 text-5xl font-semibold leading-[1.04] sm:text-6xl">{{ product.name }}</h1>
          <p v-if="product.aka" class="mt-2 text-sm font-bold uppercase tracking-[.2em] text-lime">Also known as {{ product.aka }}</p>
          <p class="mt-5 max-w-xl text-lg text-white/90">{{ product.intro[0] }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink :to="{ path: '/contact/', query: { product: product.name } }" class="btn btn-lime">Request a quote <span class="arr">↗</span></NuxtLink>
            <NuxtLink to="/products/" class="btn btn-white">All products <span class="arr">↗</span></NuxtLink>
          </div>
        </div>
        <div class="w-full lg:justify-self-end" :style="{ maxWidth: `min(100%, ${(32 * current.aspect).toFixed(1)}rem)` }">
          <div class="relative overflow-hidden rounded-[2rem] bg-black/20 shadow-2xl shadow-black/40 ring-1 ring-white/25" :style="{ aspectRatio: String(current.aspect) }">
            <img :key="current.src" :src="$img(current.src)" :alt="current.alt" class="pm-img absolute inset-0 h-full w-full object-cover" width="1200" :height="Math.round(1200 / current.aspect)" fetchpriority="high">
          </div>
          <div v-if="product.photos.length > 1" class="mt-3 flex gap-2" role="group" aria-label="Product photos">
            <button v-for="(ph, i) in product.photos" :key="ph.src" type="button" class="h-16 w-16 overflow-hidden rounded-xl ring-2 transition" :class="i === photo ? 'ring-lime' : 'ring-white/40 opacity-80 hover:opacity-100'" :aria-label="'Show photo ' + (i + 1) + ' of ' + product.photos.length" :aria-pressed="i === photo" @click="photo = i">
              <img :src="$img(ph.src)" alt="" class="h-full w-full object-cover" width="64" height="64" :loading="i === 0 ? undefined : 'lazy'">
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- about + specification -->
    <section class="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.2fr_.8fr]">
      <div class="reveal">
        <span class="chip chip-soft">About {{ product.name.toLowerCase() }}</span>
        <h2 class="mt-5 text-3xl font-semibold leading-[1.1] sm:text-5xl">{{ product.name }} <span class="serif font-normal">from Kenya.</span></h2>
        <p v-for="para in product.intro" :key="para" class="mt-5 leading-relaxed text-fg/80">{{ para }}</p>
        <ul class="mt-8 grid gap-3">
          <li v-for="h in product.highlights" :key="h" class="flex items-start gap-3">
            <span class="icon-circle mt-0.5 h-7 w-7 shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span>
            <span class="font-medium">{{ h }}</span>
          </li>
        </ul>
      </div>
      <aside class="reveal" aria-labelledby="spec-title">
        <h2 id="spec-title" class="font-sans text-xs font-bold uppercase tracking-[.2em] text-accent">Product facts</h2>
        <dl class="mt-4 grid gap-3">
          <div class="rounded-2xl border border-fg/10 bg-card px-5 py-4"><dt class="text-[11px] font-bold uppercase tracking-[.18em] text-accent">Product</dt><dd class="mt-0.5 font-medium">{{ product.name }}<template v-if="product.aka"> ({{ product.aka }})</template></dd></div>
          <div class="rounded-2xl border border-fg/10 bg-card px-5 py-4"><dt class="text-[11px] font-bold uppercase tracking-[.18em] text-accent">Country of origin</dt><dd class="mt-0.5 font-medium">Kenya</dd></div>
          <div v-for="f in product.facts" :key="f.label" class="rounded-2xl border border-fg/10 bg-card px-5 py-4"><dt class="text-[11px] font-bold uppercase tracking-[.18em] text-accent">{{ f.label }}</dt><dd class="mt-0.5 font-medium">{{ f.value }}</dd></div>
          <div class="rounded-2xl border border-fg/10 bg-card px-5 py-4"><dt class="text-[11px] font-bold uppercase tracking-[.18em] text-accent">Supplier</dt><dd class="mt-0.5 font-medium">Fresca Premier Fresh Ltd, Nairobi</dd></div>
        </dl>
        <NuxtLink :to="{ path: '/contact/', query: { product: product.name } }" class="btn btn-dark mt-6">Request a quote <span class="arr">↗</span></NuxtLink>
      </aside>
    </section>

    <!-- FAQ -->
    <section class="mx-3 rounded-[2rem] bg-soft sm:mx-4 sm:rounded-[3rem]" aria-labelledby="faq-title">
      <div class="mx-auto max-w-4xl px-5 py-20">
        <span class="chip bg-surface text-accent">Questions</span>
        <h2 id="faq-title" class="mt-5 text-3xl font-semibold leading-[1.1] sm:text-5xl">{{ product.name }}: <span class="serif font-normal">your questions answered.</span></h2>
        <div class="mt-10 grid gap-3">
          <details v-for="(f, i) in faq" :key="f.q" class="group rounded-2xl border border-fg/10 bg-surface px-5 py-4" :open="i === 0">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold"><span>{{ f.q }}</span><span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-soft transition group-open:rotate-45" aria-hidden="true">+</span></summary>
            <p class="mt-3 leading-relaxed text-fg/80">{{ f.a }}</p>
          </details>
        </div>
        <p class="mt-6 text-sm text-fg/72">More answers on our <NuxtLink to="/faq/" class="font-semibold text-accent underline">FAQ page</NuxtLink>.</p>
      </div>
    </section>

    <!-- related -->
    <section class="mx-auto max-w-6xl px-5 pt-24">
      <h2 class="text-3xl font-semibold sm:text-4xl">Other products <span class="serif font-normal">from Fresca</span></h2>
      <ul class="mt-8 grid gap-4 sm:grid-cols-3">
        <li v-for="r in related" :key="r.slug">
          <NuxtLink :to="`/products/${r.slug}/`" class="group block overflow-hidden rounded-[1.75rem] border border-fg/10 bg-card transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
            <span class="block aspect-[4/3] overflow-hidden"><img :src="$img(r.photos[0].src)" :alt="r.photos[0].alt" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" width="640" height="480" loading="lazy"></span>
            <span class="flex items-center justify-between gap-3 p-5"><span><span class="block font-semibold">{{ r.name }}</span><span class="block text-sm text-fg/72">{{ r.tag }}</span></span><span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg text-surface transition group-hover:rotate-45" aria-hidden="true">↗</span></span>
          </NuxtLink>
        </li>
      </ul>
      <nav class="mt-8 flex items-center justify-between gap-4 text-sm font-semibold" aria-label="Browse products">
        <NuxtLink :to="`/products/${prev.slug}/`" class="inline-flex items-center gap-2 text-accent hover:underline">← {{ prev.name }}</NuxtLink>
        <NuxtLink :to="`/products/${next.slug}/`" class="inline-flex items-center gap-2 text-accent hover:underline">{{ next.name }} →</NuxtLink>
      </nav>
    </section>

    <CtaBand image="/img/hero/french-beans.webp" :quote="product.name" />
  </div>
</template>
