<script setup lang="ts">
usePageSeo({
  title: 'Team',
  description: 'Meet the people behind Fresca Premier Fresh Ltd: leadership, operations, compliance and finance.',
})
const SITE = 'https://frescapremierfresh.com'
const leads = [
  { n: 'Lucas Omollo', r: 'Director', e: 'lucas@frescapremierfresh.com', p: '+254 726 262 679', tel: '+254726262679', card: SITE + '/card/lucas/' },
  { n: 'Judy Ogolla', r: 'Commercial & Operations Manager', e: 'judy@frescapremierfresh.com', p: '+254 731 615 135', tel: '+254731615135', card: SITE + '/card/judy/' },
]
const team = [
  { n: 'Brenda Ogollah', r: 'Owner & Director', b: 'Over 17 years in the fresh produce industry across Kenya and the Netherlands, including account management roles at Green Food Benelux Group and Fruit Advisor Group. Brenda connects Kenyan producers to international markets with a focus on reliability, quality and long-term partnerships.' },
  { n: 'Andrea Ogada', r: 'Administrator', b: 'Coordinates administrative processes, documentation and client support, keeping day-to-day operations and communication running smoothly.' },
  { n: 'Fredrick Harrison Kabuu', r: 'Agronomist & Compliance Auditor', b: 'Provides agronomy and compliance support to partner farms, keeping documentation and standards such as GLOBALG.A.P. and SMETA in order, and training farm and packhouse workers through Farmbase Consulting Limited.' },
  { n: 'Allan Omondi', r: 'Compliance Officer', b: 'Oversees product inspection and coordinates sampling for laboratory testing so that produce meets quality, safety and regulatory standards for local and international markets.' },
  { n: 'Jackson Muthee', r: 'Accountant', b: 'Manages financial records, transactions, budgeting and reporting, keeping the company’s finances accurate and transparent.', e: 'finance@frescapremierfresh.com' },
]
const initials = (n: string) => n.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('')
</script>

<template>
  <div>
    <PageHero eyebrow="Our team" image="/img/stock/bean-plant.webp" alt="Green bean plant" text="Experienced people across leadership, operations, compliance and finance, all focused on one thing: dependable produce.">
      The people behind <span class="serif font-normal">every carton.</span>
    </PageHero>

    <!-- leadership -->
    <section class="mx-auto max-w-6xl px-5 py-24">
      <div class="reveal">
        <span class="chip chip-soft"><i />Get in touch directly</span>
        <h2 class="mt-5 text-4xl sm:text-6xl font-semibold">Your <span class="serif font-normal">contacts</span></h2>
      </div>
      <div class="mt-12 grid gap-5 grid-cols-[minmax(0,1fr)] md:grid-cols-2">
        <article v-for="(l, n) in leads" :key="l.n" class="reveal rounded-[2rem] bg-forest text-white p-7 sm:p-9 relative overflow-hidden" :style="{ transitionDelay: n * 90 + 'ms' }">
          <div class="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-leaf-500/30 blur-3xl" aria-hidden="true" />
          <div class="relative">
            <span class="grid place-items-center h-20 w-20 rounded-full bg-lime text-forest font-semibold text-2xl">{{ initials(l.n) }}</span>
            <h3 class="mt-6 text-3xl font-semibold">{{ l.n }}</h3>
            <p class="text-lime font-medium">{{ l.r }}</p>
            <ul class="mt-6 grid gap-2 text-sm text-white/80">
              <li><a :href="'tel:' + l.tel" class="hover:text-lime transition">{{ l.p }}</a></li>
              <li><a :href="'mailto:' + l.e" class="hover:text-lime transition break-all">{{ l.e }}</a></li>
            </ul>
            <div class="mt-7 flex flex-wrap gap-3">
              <a :href="l.card" class="btn btn-lime">Digital card <span class="arr">↗</span></a>
              <a :href="'mailto:' + l.e" class="btn btn-white">Email <span class="arr">↗</span></a>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- wider team -->
    <section class="bg-soft rounded-[2rem] sm:rounded-[3rem] mx-3 sm:mx-4">
      <div class="mx-auto max-w-6xl px-5 py-20">
        <div class="reveal">
          <span class="chip bg-surface text-accent"><i />The wider team</span>
          <h2 class="mt-5 text-4xl sm:text-6xl font-semibold">Experience that <span class="serif font-normal">delivers</span></h2>
        </div>
        <div class="mt-12 grid gap-5 grid-cols-[minmax(0,1fr)] md:grid-cols-2">
          <article v-for="(m, n) in team" :key="m.n" class="reveal rounded-[1.75rem] bg-surface border border-fg/10 p-6 sm:p-7 flex gap-5" :style="{ transitionDelay: (n % 2) * 80 + 'ms' }">
            <span class="icon-circle h-16 w-16 shrink-0 text-xl font-semibold">{{ initials(m.n) }}</span>
            <div class="min-w-0">
              <h3 class="text-xl font-semibold">{{ m.n }}</h3>
              <p class="text-sm font-semibold text-accent">{{ m.r }}</p>
              <p class="mt-3 text-sm text-fg/70 leading-relaxed">{{ m.b }}</p>
              <a v-if="m.e" :href="'mailto:' + m.e" class="mt-3 inline-block text-sm font-semibold text-accent hover:underline break-all">{{ m.e }}</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <CtaBand image="/img/stock/farmer.webp" />
  </div>
</template>
