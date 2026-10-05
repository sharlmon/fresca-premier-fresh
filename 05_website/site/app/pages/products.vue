<script setup lang="ts">
usePageSeo({
  title: 'Products',
  description: 'French beans, snow peas, sugar snap peas, baby corn and a wider range of fresh produce, packed to your specification and exported from Kenya.',
})
const { $img } = useNuxtApp()

const core = [
  { t: 'French Beans', tag: 'Extra fine & fine', d: 'Also known as haricot verts. Tender, slender pods, grown from seedlings and graded for consistency.', img: '/img/stock/beans-dark.webp' },
  { t: 'Snow Peas', tag: 'Mangetout', d: 'Flat, tender-podded peas with an excellent fibre content, sorted and packed for freshness.', img: '/img/stock/snow-peas-dew.webp' },
  { t: 'Sugar Snap Peas', tag: 'Crisp & sweet', d: 'Rounded, crunchy pods with a naturally sweet flavour and good fibre content.', img: '/img/stock/snap-pea-vine.webp' },
  { t: 'Baby Corn', tag: 'Tray-packed', d: 'Tender baby corn, trimmed and packed in punnets ready for retail.', img: '/img/baby-corn.webp' },
]
const range = [
  { t: 'Avocados', d: 'Creamy, oil-rich fruit with a rich, buttery flavour.', img: '/img/products/avocado.webp' },
  { t: 'Mangoes', d: 'Juicy, sweet fruit that is as good fresh as it is in desserts.', img: '/img/products/mango.webp' },
  { t: 'Passion Fruit', d: 'Aromatic, tangy pulp that is a good source of vitamin C.', img: '/img/products/passion-fruit.webp' },
  { t: 'Carrots', d: 'Crisp, naturally sweet roots rich in beta-carotene.', img: '/img/products/carrots.webp' },
  { t: 'Chillies', d: 'Bird’s-eye chillies with a clean, fiery heat; green, red or mixed punnets.', img: '/img/products/chillies.webp' },
  { t: 'Rosemary', d: 'A fragrant herb, prized in the kitchen for its aroma and flavour.', img: '/img/products/rosemary.webp' },
  { t: 'Chives', d: 'Mild, onion-flavoured herb for garnishing and flavouring.', img: '/img/products/chives.webp' },
]
const pack = [
  { t: 'Extra-fine beans carton', s: '12 × 250 g', img: '/img/packaging/beans-carton.webp' },
  { t: 'Mangetout carton', s: '12 × 250 g', img: '/img/packaging/mangetout-carton.webp' },
  { t: 'Retail punnets', s: 'Beans, peas, baby corn, chillies', img: '/img/packaging/punnet.webp' },
]
</script>

<template>
  <div>
    <PageHero eyebrow="What we grow" image="/img/stock/snap-pea-vine.webp" alt="A sugar snap pea hanging on the vine" pos="center 40%" text="Premium vegetables, carefully selected, graded and packed for importers, retailers and food-service companies.">
      Fresh from <span class="serif font-normal">our farms.</span>
    </PageHero>

    <!-- core range -->
    <section class="mx-auto max-w-6xl px-5 py-24">
      <div class="reveal">
        <span class="chip chip-soft"><i />Core range</span>
        <h2 class="mt-5 text-4xl sm:text-6xl font-semibold">Our <span class="serif font-normal">specialities</span></h2>
      </div>
      <div class="mt-12 grid gap-5 sm:grid-cols-2">
        <article v-for="(p, n) in core" :key="p.t" class="reveal group relative overflow-hidden rounded-[2rem] aspect-[4/3] isolate" :style="{ transitionDelay: n * 70 + 'ms' }">
          <img :src="$img(p.img)" :alt="p.t" class="absolute inset-0 -z-10 h-full w-full object-cover transition duration-700 group-hover:scale-105" width="1200" height="900" loading="lazy">
          <div class="absolute inset-0 -z-10 bg-gradient-to-t from-forest/85 via-forest/25 to-transparent" />
          <div class="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
            <span class="chip glass">{{ p.tag }}</span>
            <h3 class="mt-3 text-3xl sm:text-4xl font-semibold">{{ p.t }}</h3>
            <p class="mt-2 max-w-md text-sm text-white/85 leading-relaxed">{{ p.d }}</p>
          </div>
        </article>
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
          <article v-for="(p, n) in range" :key="p.t" class="reveal rounded-[1.75rem] bg-surface p-5 border border-fg/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition" :style="{ transitionDelay: (n % 4) * 70 + 'ms' }">
            <div class="grid place-items-center aspect-[4/3] rounded-2xl bg-card">
              <img :src="$img(p.img)" :alt="p.t" class="max-h-[85%] w-auto object-contain" width="640" height="470" loading="lazy">
            </div>
            <h3 class="mt-4 font-semibold text-lg">{{ p.t }}</h3>
            <p class="mt-1 text-sm text-fg/65 leading-relaxed">{{ p.d }}</p>
          </article>
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
          <div class="overflow-hidden rounded-[1.75rem] aspect-[4/3] bg-card"><img :src="$img(p.img)" :alt="p.t" class="h-full w-full object-cover" width="1000" height="700" loading="lazy"></div>
          <figcaption class="mt-4 px-1"><span class="font-semibold">{{ p.t }}</span><span class="block text-sm text-fg/60">{{ p.s }}</span></figcaption>
        </figure>
      </div>
    </section>

    <DownloadCard />

    <CtaBand image="/img/stock/crop-rows.webp" />
  </div>
</template>
