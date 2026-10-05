<script setup lang="ts">
usePageSeo({
  title: 'Sustainable Farming in Kenya · Fresca Premier Fresh',
  fullTitle: true,
  description: 'We work with local farmers and communities to promote sustainable agriculture, protect the environment and deliver goodness that lasts.',
})
const { $img } = useNuxtApp()
const items = [
  { t: 'Responsible farming', d: 'We support sustainable agriculture and responsible farming practices across our growers.' },
  { t: 'Farmers & communities', d: 'Long-term partnerships with 500+ local farmers, built on trust, integrity and fair dealing.' },
  { t: 'Worker welfare', d: 'Ethical sourcing and worker welfare are part of how we train and audit farms and packhouses.' },
  { t: 'Protecting the environment', d: 'We work with growers to protect the land and water our produce depends on, so goodness lasts.' },
]
</script>

<template>
  <div>
    <PageHero eyebrow="Sustainability" image="/img/stock/farmer.webp" alt="A farmer tending green crops" pos="center 30%" text="We work with local farmers and communities to promote sustainable agriculture, protect the environment and deliver goodness that lasts.">
      Sustainable today, <span class="serif font-normal">better tomorrow.</span>
    </PageHero>

    <section class="mx-auto max-w-6xl px-5 py-24">
      <div class="reveal max-w-2xl">
        <span class="chip chip-soft">Our approach</span>
        <h2 class="mt-5 text-4xl sm:text-6xl font-semibold leading-[1.05]">Good for the land, <span class="serif font-normal">good for people.</span></h2>
      </div>
      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article v-for="(p, n) in items" :key="p.t" class="reveal rounded-[1.75rem] bg-card border border-fg/10 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition" :style="{ transitionDelay: n * 80 + 'ms' }">
          <span class="block text-xs font-bold tracking-[.25em] text-accent" aria-hidden="true">{{ String(n + 1).padStart(2, '0') }}</span>
          <h3 class="mt-3 font-semibold text-lg">{{ p.t }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-fg/65">{{ p.d }}</p>
        </article>
      </div>
    </section>

    <section class="relative isolate overflow-hidden mx-3 sm:mx-4 rounded-[2rem] sm:rounded-[3rem]">
      <img :src="$img('/img/stock/field-hills.webp')" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" width="1600" height="900" loading="lazy">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/75 to-forest/30" />
      <div class="mx-auto max-w-6xl px-6 sm:px-10 py-24 text-white">
        <p class="reveal serif text-3xl sm:text-5xl leading-tight max-w-2xl">Growing together with our farmers, season after season.</p>
        <div class="reveal mt-10 grid grid-cols-2 gap-4 max-w-md">
          <div class="glass rounded-2xl p-5"><div class="text-4xl font-semibold">500+</div><div class="text-sm text-white/75">Trusted farmers</div></div>
          <div class="glass rounded-2xl p-5"><div class="text-4xl font-semibold">20+</div><div class="text-sm text-white/75">Markets served</div></div>
        </div>
      </div>
    </section>

    <CtaBand image="/img/stock/crop-rows.webp" />
  </div>
</template>
