<script setup lang="ts">
import { faqGroups, allFaqs } from '~/data/faq'
const { siteUrl } = useRuntimeConfig().public
const root = String(siteUrl).replace(/\/$/, '')
usePageSeo({
  title: 'FAQ · Exporting Fresh Produce from Kenya | Fresca',
  fullTitle: true,
  description: 'Answers about Fresca Premier Fresh: what we export from Kenya, packing, certifications (GLOBALG.A.P., KEPHIS, AFA), traceability and how to get a quote.',
  nodes: [faqNode(`${root}/faq/`, allFaqs)],
})
</script>

<template>
  <div>
    <PageHero eyebrow="FAQ" image="/img/hero/french-beans.webp" alt="" pos="center 50%" text="Short, direct answers about what we export, how we pack, our certifications and how to order.">
      Your questions, <span class="serif font-normal">answered.</span>
    </PageHero>

    <div class="mx-auto max-w-4xl px-5 py-20">
      <section v-for="(g, gi) in faqGroups" :key="g.title" class="mb-14" :aria-labelledby="'g' + gi">
        <h2 :id="'g' + gi" class="text-2xl font-semibold sm:text-3xl">{{ g.title }}</h2>
        <div class="mt-6 grid gap-3">
          <details v-for="(f, i) in g.items" :key="f.q" class="group rounded-2xl border border-fg/10 bg-card px-5 py-4" :open="gi === 0 && i === 0">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold"><span>{{ f.q }}</span><span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-soft transition group-open:rotate-45" aria-hidden="true">+</span></summary>
            <p class="mt-3 leading-relaxed text-fg/80">{{ f.a }}</p>
          </details>
        </div>
      </section>
      <p class="text-fg/80">Can’t find your answer? <NuxtLink to="/contact/" class="font-semibold text-accent underline">Ask us directly</NuxtLink> or browse our <NuxtLink to="/products/" class="font-semibold text-accent underline">products</NuxtLink>.</p>
    </div>

    <CtaBand image="/img/hero/french-beans.webp" />
  </div>
</template>
