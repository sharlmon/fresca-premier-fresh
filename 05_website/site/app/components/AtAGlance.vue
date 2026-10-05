<script setup lang="ts">
// "At a glance": the key facts as a definition list. Short, factual and self-contained, so search and AI answer engines can quote it.
import { site } from '~/data/site'
const rows = [
  { t: 'Company', d: `${site.legalName}, a Kenyan fresh produce export company` },
  { t: 'Based in', d: `${site.address.city}, ${site.address.country} (${site.address.street}, P.O. Box ${site.address.poBox})` },
  { t: 'Core products', d: 'French beans (extra fine and fine), snow peas (mangetout), sugar snap peas and baby corn' },
  { t: 'Also supplied', d: 'Avocados, mangoes, passion fruit, carrots, chillies, rosemary and chives' },
  { t: 'Customers', d: 'Wholesale importers, retailers and food-service companies in Europe and other international markets' },
  { t: 'Certifications', d: 'GLOBALG.A.P. certification, with KEPHIS and AFA credentials' },
  { t: 'Packing', d: 'Export cartons and retail punnets, packed to customer specification' },
  { t: 'Quality', d: 'Graded to international standards, with full traceability from farm to delivery' },
]
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 pb-24" aria-labelledby="glance-title">
    <div class="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
      <div class="reveal">
        <span class="chip chip-soft"><i />At a glance</span>
        <h2 id="glance-title" class="mt-5 text-3xl font-semibold leading-[1.1] sm:text-5xl">Fresca Premier Fresh, <span class="serif font-normal">in brief.</span></h2>
        <p class="mt-5 max-w-md leading-relaxed text-fg/80">{{ site.description }}</p>
        <div class="mt-7 flex flex-wrap gap-3">
          <NuxtLink to="/faq/" class="btn btn-dark">Read the FAQ <span class="arr">↗</span></NuxtLink>
          <NuxtLink to="/contact/" class="btn btn-white !bg-fg/5 !text-fg">Contact us <span class="arr">↗</span></NuxtLink>
        </div>
      </div>
      <dl class="reveal divide-y divide-fg/10 overflow-hidden rounded-[2rem] border border-fg/10 bg-card">
        <div v-for="r in rows" :key="r.t" class="grid gap-1 px-6 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
          <dt class="text-xs font-bold uppercase tracking-[.18em] text-accent sm:pt-0.5">{{ r.t }}</dt>
          <dd class="font-medium leading-relaxed">{{ r.d }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
