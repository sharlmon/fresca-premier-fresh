<script setup lang="ts">
import { certifications, network } from '~/data/trust'
const { $img } = useNuxtApp()
withDefaults(defineProps<{ parts?: 'all' | 'certs' | 'network' }>(), { parts: 'all' })
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 pb-24" aria-labelledby="trust-title">
    <div class="reveal rounded-[2rem] sm:rounded-[2.5rem] bg-soft p-6 sm:p-10">
      <div class="max-w-2xl">
        <span class="chip bg-surface text-accent"><i />Credentials &amp; partners</span>
        <h2 id="trust-title" class="mt-5 text-3xl sm:text-5xl font-semibold leading-[1.08]">
          {{ parts === 'certs' ? 'Certified and' : parts === 'network' ? 'Connected and' : 'Certified, connected and' }} <span class="serif font-normal">trusted.</span>
        </h2>
      </div>

      <div class="mt-10 grid gap-8" :class="parts === 'all' ? 'lg:grid-cols-[1.35fr_1fr]' : ''">
        <!-- certifications -->
        <div v-if="parts !== 'network'">
          <h3 class="font-sans text-xs font-bold uppercase tracking-[.2em] text-accent">Our certifications</h3>
          <ul class="mt-4 grid gap-3" :class="parts === 'certs' ? 'sm:grid-cols-3' : 'sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3'">
            <li v-for="c in certifications" :key="c.key" class="flex flex-col rounded-[1.5rem] bg-surface border border-fg/10 p-5">
              <span class="icon-circle h-12 w-12"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="c.icon" /></span>
              <p class="mt-4 text-xl font-semibold">{{ c.name }}</p>
              <p class="text-xs font-bold uppercase tracking-[.15em] text-accent">{{ c.label }}</p>
              <p class="mt-2 text-sm leading-relaxed text-fg/72">{{ c.text }}</p>
              <p v-if="c.ggn" class="mt-3 text-xs font-semibold text-fg/72">GGN {{ c.ggn }}<template v-if="c.verifyUrl"> · <a :href="c.verifyUrl" target="_blank" rel="noopener" class="text-accent underline">Verify status</a></template></p>
            </li>
          </ul>
        </div>

        <!-- partner -->
        <div v-if="parts !== 'certs'">
          <h3 class="font-sans text-xs font-bold uppercase tracking-[.2em] text-accent">Our partner</h3>
          <ul class="mt-4 grid gap-3 sm:grid-cols-2">
            <li v-for="n in network" :key="n.key" class="flex flex-col items-center rounded-[1.5rem] bg-white border border-fg/10 p-5 text-center text-forest">
              <a v-if="n.href" :href="n.href" target="_blank" rel="noopener" class="grid h-28 w-full place-items-center" :aria-label="n.name + ' (opens in a new tab)'">
                <img :src="$img(n.logo)" :alt="n.name + ' logo'" class="max-h-28 w-auto object-contain" :width="n.w" :height="n.h" loading="lazy">
              </a>
              <div v-else class="grid h-28 w-full place-items-center">
                <img :src="$img(n.logo)" :alt="n.name + ' logo'" class="max-h-24 w-auto object-contain" :width="n.w" :height="n.h" loading="lazy">
              </div>
              <p class="mt-3 text-[11px] font-bold uppercase tracking-[.2em] text-leaf-700">{{ n.role }}</p>
              <p class="font-semibold">{{ n.name }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
