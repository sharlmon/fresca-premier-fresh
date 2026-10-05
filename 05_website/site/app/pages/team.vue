<script setup lang="ts">
import type { Member } from '~/components/TeamCard.vue'

usePageSeo({
  title: 'Team',
  description: 'Meet the people behind Fresca Premier Fresh Ltd: leadership, sales, logistics, production, finance and technology.',
})

const SITE = 'https://frescapremierfresh.com'
// To add a photo: put the file in public/img/team/ and set photo: '/img/team/<name>.webp'. To add a profile: fill in bio.
const leaders: Member[] = [
  { slug: 'lucas', name: 'Lucas Omollo', role: 'Director', dept: 'Leadership', email: 'lucas@frescapremierfresh.com', phone: '+254 726 262 679', tel: '+254726262679', card: SITE + '/card/lucas/' },
  { slug: 'judy', name: 'Judy Ogolla', role: 'Commercial & Operations Manager', dept: 'Commercial', email: 'judy@frescapremierfresh.com', phone: '+254 731 615 135', tel: '+254731615135', card: SITE + '/card/judy/' },
  { slug: 'brenda', name: 'Brenda Ogollah', role: 'Sales Director', dept: 'Sales' },
]
const team: Member[] = [
  { slug: 'allan', name: 'Allan Omondi', role: 'Logistics & Compliance', dept: 'Logistics' },
  { slug: 'dominic', name: 'Dominic Mwanya', role: 'Production & Compliance', dept: 'Production' },
  { slug: 'benson', name: 'Benson Kamitia', role: 'Finance', dept: 'Finance' },
  { slug: 'sharlmon', name: 'Sharlmon Junior', role: 'ICT & Technical Lead', dept: 'Technology' },
]
</script>

<template>
  <div>
    <PageHero eyebrow="Our team" image="/img/stock/bean-plant.webp" alt="Green bean plant" text="Leadership, sales, logistics, production, finance and technology, all focused on one thing: dependable produce.">
      The people behind <span class="serif font-normal">every carton.</span>
    </PageHero>

    <!-- leadership -->
    <section class="mx-auto max-w-6xl px-5 pt-24">
      <div class="reveal max-w-2xl">
        <span class="chip chip-soft">Leadership</span>
        <h2 class="mt-5 text-4xl sm:text-6xl font-semibold leading-[1.05]">Guiding the <span class="serif font-normal">business</span></h2>
        <p class="mt-4 text-fg/72 leading-relaxed">The people to talk to about orders, partnerships and where Fresca is heading.</p>
      </div>
      <div class="mt-14 grid grid-cols-[minmax(0,1fr)] gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <TeamCard v-for="(m, n) in leaders" :key="m.slug" :m="m" lead :tone="n" class="reveal" :style="{ transitionDelay: n * 100 + 'ms' }" />
      </div>
    </section>

    <!-- operations -->
    <section class="bg-soft rounded-[2rem] sm:rounded-[3rem] mx-3 sm:mx-4 mt-24">
      <div class="mx-auto max-w-6xl px-5 py-20">
        <div class="reveal max-w-2xl">
          <span class="chip bg-surface text-accent">Operations &amp; support</span>
          <h2 class="mt-5 text-4xl sm:text-6xl font-semibold leading-[1.05]">Keeping everything <span class="serif font-normal">moving</span></h2>
          <p class="mt-4 text-fg/72 leading-relaxed">From the farm and packhouse to the shipping dock, the books and the technology behind them.</p>
        </div>
        <div class="mt-14 grid grid-cols-[minmax(0,1fr)] gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <TeamCard v-for="(m, n) in team" :key="m.slug" :m="m" :tone="n + 1" class="reveal" :style="{ transitionDelay: n * 90 + 'ms' }" />
        </div>
      </div>
    </section>

    <CtaBand image="/img/stock/farmer.webp" />
  </div>
</template>
