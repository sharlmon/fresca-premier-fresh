<script setup lang="ts">
usePageSeo({
  title: 'Quality & Safety',
  description: 'Strict quality control, full traceability and international food safety compliance at every step from farm to export.',
})
const { $img } = useNuxtApp()
const items = [
  { t: 'Graded to standard', d: 'Every harvest is inspected and graded so produce meets international quality standards and your specification.', i: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>' },
  { t: 'Full traceability', d: 'Strict documentation lets us trace produce at every step of the supply chain, from the farm to the final delivery.', i: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>' },
  { t: 'Audits & compliance', d: 'Our compliance team supports farms and packhouses in meeting international certification and export requirements.', i: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>' },
  { t: 'Laboratory testing', d: 'Produce samples are collected and submitted for laboratory testing so every shipment meets regulatory and export requirements.', i: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3"/><path d="M7.5 15h9"/>' },
  { t: 'Trained people', d: 'We train farm and packhouse workers in best agricultural practice, quality control and worker welfare.', i: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { t: 'Food-safe packing', d: 'Produce is packed with care in food-safe materials that protect quality and freshness all the way to market.', i: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>' },
]
const steps = ['Sourcing', 'Grading', 'Packing', 'Delivery']
</script>

<template>
  <div>
    <PageHero eyebrow="Quality & Safety" image="/img/factory/french-beans-bunch.webp" alt="A bunch of fresh French beans on a packing table" pos="center 60%" text="Food safety and quality are at the heart of everything we do.">
      Quality you can <span class="serif font-normal">trace.</span>
    </PageHero>

    <section class="mx-auto max-w-6xl px-5 py-24 grid lg:grid-cols-[.9fr_1.1fr] gap-12 items-start">
      <div class="reveal lg:sticky lg:top-28">
        <span class="chip chip-soft"><i />Our commitment</span>
        <h2 class="mt-5 text-4xl sm:text-5xl font-semibold leading-[1.08]">Safe, <span class="serif font-normal">sustainable,</span> ethical.</h2>
        <p class="mt-5 text-fg/70 leading-relaxed">We work closely with growers and packhouses that comply with internationally recognised standards, and we continuously strive to meet customer requirements on food safety, sustainability and ethical sourcing.</p>
        <p class="mt-4 text-fg/70 leading-relaxed">We hold <b class="text-fg">GLOBALG.A.P.</b> certification, alongside <b class="text-fg">KEPHIS</b> and <b class="text-fg">AFA</b> credentials, and keep the documentation and training that go with them.</p>
        <NuxtLink to="/team" class="btn btn-dark mt-8">Meet the team <span class="arr">↗</span></NuxtLink>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <article v-for="(p, n) in items" :key="p.t" class="reveal rounded-[1.75rem] bg-card border border-fg/10 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition" :style="{ transitionDelay: (n % 2) * 80 + 'ms' }">
          <span class="icon-circle h-12 w-12"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="p.i" /></span>
          <h3 class="mt-5 font-semibold text-lg">{{ p.t }}</h3>
          <p class="mt-1.5 text-sm leading-relaxed text-fg/65">{{ p.d }}</p>
        </article>
      </div>
    </section>

    <TrustBand parts="certs" />

    <!-- chain -->
    <section class="relative isolate overflow-hidden mx-3 sm:mx-4 rounded-[2rem] sm:rounded-[3rem]">
      <img :src="$img('/img/stock/crop-rows.webp')" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" width="2000" height="1499" loading="lazy">
      <div class="absolute inset-0 -z-10 bg-forest/85" />
      <div class="mx-auto max-w-6xl px-5 py-20 text-white">
        <div class="reveal text-center">
          <h2 class="text-4xl sm:text-5xl font-semibold">Checked at <span class="serif font-normal">every step</span></h2>
          <p class="mt-4 mx-auto max-w-xl text-white/75">Quality control and traceability run through the whole chain, so nothing is left to chance between the farm and your warehouse.</p>
        </div>
        <ol class="mt-12 grid gap-3 sm:grid-cols-4">
          <li v-for="(s, i) in steps" :key="s" class="reveal glass rounded-full px-6 py-5 flex items-center gap-4" :style="{ transitionDelay: i * 90 + 'ms' }">
            <span class="grid place-items-center h-10 w-10 rounded-full bg-lime font-semibold text-forest">{{ i + 1 }}</span>
            <span class="font-semibold">{{ s }}</span>
          </li>
        </ol>
      </div>
    </section>

    <CtaBand image="/img/stock/farmer.webp" />
  </div>
</template>
