<script setup lang="ts">
import { certifications, network } from '~/data/trust'
const { $img } = useNuxtApp()
withDefaults(defineProps<{ parts?: 'all' | 'certs' | 'network' }>(), { parts: 'all' })
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 pb-24" aria-labelledby="trust-title">
    <div class="reveal rounded-[2rem] sm:rounded-[2.5rem] bg-soft p-6 sm:p-10">
      <div class="max-w-2xl">
        <span class="chip bg-surface text-accent">Credentials &amp; partners</span>
        <h2 id="trust-title" class="mt-5 text-3xl sm:text-5xl font-semibold leading-[1.08]">
          {{ parts === 'certs' ? 'Certified and' : parts === 'network' ? 'Connected and' : 'Certified, connected and' }} <span class="serif font-normal">trusted.</span>
        </h2>
      </div>

      <div class="mt-10 grid gap-10">
        <!-- certifications -->
        <div v-if="parts !== 'network'">
          <h3 class="font-sans text-xs font-bold uppercase tracking-[.2em] text-accent">Our certifications</h3>
          <ul class="mt-4 grid gap-4 sm:grid-cols-3">
            <li v-for="c in certifications" :key="c.key" class="flex flex-col rounded-[1.5rem] border border-fg/10 border-t-4 border-t-accent bg-surface p-6">
              <p class="text-2xl font-semibold leading-tight">{{ c.name }}</p>
              <p class="mt-1 text-xs font-bold uppercase tracking-[.15em] text-accent">{{ c.label }}</p>
              <p class="mt-3 text-sm leading-relaxed text-fg/72">{{ c.text }}</p>
              <p v-if="c.ggn" class="mt-3 text-xs font-semibold text-fg/72">GGN {{ c.ggn }}<template v-if="c.verifyUrl"> · <a :href="c.verifyUrl" target="_blank" rel="noopener" class="text-accent underline">Verify status</a></template></p>
            </li>
          </ul>
        </div>

        <!-- partner -->
        <div v-if="parts !== 'certs'">
          <h3 class="font-sans text-xs font-bold uppercase tracking-[.2em] text-accent">Our partner</h3>
          <ul class="mt-4 grid gap-4">
            <li v-for="n in network" :key="n.key" class="flex flex-col items-center gap-5 rounded-[1.5rem] border border-fg/10 bg-surface p-5 sm:flex-row sm:p-6">
              <component :is="n.href ? 'a' : 'div'" :href="n.href" :target="n.href ? '_blank' : undefined" :rel="n.href ? 'noopener' : undefined" :aria-label="n.href ? n.name + ' (opens in a new tab)' : undefined" class="grid h-28 w-28 shrink-0 place-items-center rounded-2xl bg-white p-1.5">
                <img :src="$img(n.logo)" :alt="n.name + ' logo'" class="max-h-28 w-auto object-contain" :width="n.w" :height="n.h" loading="lazy">
              </component>
              <div class="text-center sm:text-left">
                <p class="text-[11px] font-bold uppercase tracking-[.2em] text-accent">{{ n.role }}</p>
                <p class="text-xl font-semibold">{{ n.name }}</p>
                <p class="mt-1 max-w-xl text-sm text-fg/72">{{ n.blurb }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
