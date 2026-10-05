<script setup lang="ts">
usePageSeo({
  title: 'Quality & Food Safety · GLOBALG.A.P. Certified Exporter',
  fullTitle: true,
  description: 'Strict quality control, full traceability and GLOBALG.A.P. certification at every step from farm to export, with KEPHIS and AFA credentials.',
})
const { $img } = useNuxtApp()
const items = [
  { t: 'Graded to standard', d: 'Every harvest is inspected and graded so produce meets international quality standards and your specification.' },
  { t: 'Full traceability', d: 'Strict documentation lets us trace produce at every step of the supply chain, from the farm to the final delivery.' },
  { t: 'Audits & compliance', d: 'Our compliance team supports farms and packhouses in meeting international certification and export requirements.' },
  { t: 'Laboratory testing', d: 'Produce samples are collected and submitted for laboratory testing so every shipment meets regulatory and export requirements.' },
  { t: 'Trained people', d: 'We train farm and packhouse workers in best agricultural practice, quality control and worker welfare.' },
  { t: 'Food-safe packing', d: 'Produce is packed with care in food-safe materials that protect quality and freshness all the way to market.' },
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
        <span class="chip chip-soft">Our commitment</span>
        <h2 class="mt-5 text-4xl sm:text-5xl font-semibold leading-[1.08]">Safe, <span class="serif font-normal">sustainable,</span> ethical.</h2>
        <p class="mt-5 text-fg/70 leading-relaxed">We work closely with growers and packhouses that comply with internationally recognised standards, and we continuously strive to meet customer requirements on food safety, sustainability and ethical sourcing.</p>
        <p class="mt-4 text-fg/70 leading-relaxed">We hold <b class="text-fg">GLOBALG.A.P.</b> certification, alongside <b class="text-fg">KEPHIS</b> and <b class="text-fg">AFA</b> credentials, and keep the documentation and training that go with them.</p>
        <NuxtLink to="/team/" class="btn btn-dark mt-8">Meet the team <span class="arr">↗</span></NuxtLink>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <article v-for="(p, n) in items" :key="p.t" class="reveal rounded-[1.75rem] bg-card border border-fg/10 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition" :style="{ transitionDelay: (n % 2) * 80 + 'ms' }">
          <span class="block text-xs font-bold tracking-[.25em] text-accent" aria-hidden="true">{{ String(n + 1).padStart(2, '0') }}</span>
          <h3 class="mt-3 font-semibold text-lg">{{ p.t }}</h3>
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
