<script setup lang="ts">
usePageSeo({
  title: 'About us',
  description: 'Fresca Premier Fresh Ltd is a Kenyan fresh produce export company supplying premium-quality vegetables to international markets.',
})
const { $img } = useNuxtApp()
const offer = [
  'Premium quality fresh vegetables',
  'Reliable sourcing and supply',
  'Strict quality control procedures',
  'Full product traceability',
  'Compliance with international food safety requirements',
  'Flexible packing to customer specifications',
  'Commitment to timely deliveries',
  'Customer-focused service',
]
const stats = [['20+', 'International markets'], ['500+', 'Trusted farmers'], ['100%', 'Quality & food safety']]
</script>

<template>
  <div>
    <PageHero eyebrow="About us" image="/img/stock/field-hills.webp" alt="Green crop fields under a soft evening sky" text="A Kenyan fresh produce exporter built on quality, food safety and long-term partnerships.">
      Premium produce, <span class="serif font-normal">grown with care.</span>
    </PageHero>

    <!-- overview -->
    <section class="mx-auto max-w-6xl px-5 py-24 grid lg:grid-cols-2 gap-12 items-center">
      <div class="reveal">
        <span class="chip chip-soft"><i />Company overview</span>
        <h2 class="mt-5 text-3xl sm:text-5xl font-semibold leading-[1.1]">Fresh vegetables that meet the <span class="serif font-normal">highest standards.</span></h2>
        <p class="mt-6 text-fg/70 leading-relaxed">Fresca Premier Fresh Ltd is a Kenyan fresh produce export company committed to supplying premium-quality vegetables to international markets. We specialise in the production, sourcing, packing and export of fresh vegetables that meet the highest international standards for quality, food safety and traceability.</p>
        <p class="mt-4 text-fg/70 leading-relaxed">Our mission is to build long-term partnerships by consistently delivering fresh, safe and high-quality produce while supporting sustainable agriculture and responsible farming practices.</p>
        <NuxtLink to="/products" class="btn btn-dark mt-8">See what we grow <span class="arr">↗</span></NuxtLink>
      </div>
      <div class="reveal relative">
        <img :src="$img('/img/packhouse.webp')" alt="Packhouse team grading green beans" class="w-full aspect-[4/5] object-cover rounded-[2rem]" width="960" height="1280" loading="lazy">
        <div class="glass absolute left-4 bottom-4 right-4 sm:right-auto rounded-2xl px-5 py-4 text-white">
          <p class="serif text-xl">Graded by hand, packed with care.</p>
        </div>
      </div>
    </section>

    <!-- stats -->
    <section class="mx-auto max-w-6xl px-5">
      <div class="reveal flex flex-wrap justify-center gap-x-10 gap-y-6 rounded-[2rem] bg-soft px-4 py-10 text-center">
        <div v-for="s in stats" :key="s[1]" class="flex-1 basis-24">
          <div class="text-4xl sm:text-6xl font-semibold tracking-tight">{{ s[0] }}</div>
          <div class="mt-1 text-xs sm:text-sm font-medium text-fg/72">{{ s[1] }}</div>
        </div>
      </div>
    </section>

    <!-- vision + mission -->
    <section class="mx-auto max-w-6xl px-5 pt-24 grid md:grid-cols-2 gap-5">
      <article class="reveal rounded-[2rem] bg-card border border-fg/10 p-8 sm:p-10">
        <span class="icon-circle h-12 w-12"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></span>
        <h3 class="mt-6 text-3xl font-semibold">Our <span class="serif font-normal">vision</span></h3>
        <p class="mt-3 text-fg/70 leading-relaxed">To become a trusted supplier of premium Kenyan fresh vegetables to international markets by delivering quality, consistency and exceptional customer service.</p>
      </article>
      <article class="reveal rounded-[2rem] bg-card border border-fg/10 p-8 sm:p-10">
        <span class="icon-circle h-12 w-12"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span>
        <h3 class="mt-6 text-3xl font-semibold">Our <span class="serif font-normal">mission</span></h3>
        <p class="mt-3 text-fg/70 leading-relaxed">To provide fresh, safe and high-quality vegetables while building long-term partnerships based on trust, integrity and reliability.</p>
      </article>
    </section>

    <!-- why us -->
    <section class="mx-auto max-w-6xl px-5 pt-24 grid lg:grid-cols-[.9fr_1.1fr] gap-12">
      <div class="reveal">
        <span class="chip chip-soft"><i />Why Fresca Premier Fresh</span>
        <h2 class="mt-5 text-4xl sm:text-5xl font-semibold leading-[1.08]">Built for importers who <span class="serif font-normal">can’t compromise.</span></h2>
        <p class="mt-5 max-w-md text-fg/70 leading-relaxed">Our products are carefully selected, graded, packed and prepared to meet the specifications of wholesale importers, retailers and food-service companies across Europe and other international markets.</p>
      </div>
      <ul class="grid sm:grid-cols-2 gap-3">
        <li v-for="(o, n) in offer" :key="o" class="reveal flex items-start gap-3 rounded-2xl bg-card border border-fg/10 p-4" :style="{ transitionDelay: n * 50 + 'ms' }">
          <span class="icon-circle h-8 w-8 shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
          <span class="text-sm font-medium leading-snug pt-1.5">{{ o }}</span>
        </li>
      </ul>
    </section>

    <DownloadCard />

    <CtaBand image="/img/stock/crop-rows.webp" />
  </div>
</template>
