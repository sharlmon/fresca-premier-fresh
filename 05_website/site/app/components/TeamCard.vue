<script setup lang="ts">
// One team member. `photo` is a path under /public (e.g. '/img/team/lucas.webp'); until it is set a designed placeholder is shown.
export interface Member {
  slug: string; name: string; role: string; dept: string
  photo?: string | null; bio?: string | null
  email?: string; phone?: string; tel?: string; card?: string
}
const props = defineProps<{ m: Member; lead?: boolean; tone?: number }>()
const { $img } = useNuxtApp()
const initials = computed(() => props.m.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join(''))
const tones = [
  'from-leaf-700 via-leaf-500 to-lime/70',
  'from-forest via-leaf-700 to-leaf-400',
  'from-leaf-500 via-leaf-700 to-forest',
  'from-forest via-leaf-500 to-sun-400/70',
]
const tone = computed(() => tones[(props.tone ?? 0) % tones.length])
</script>

<template>
  <article class="group">
    <!-- portrait -->
    <div class="relative isolate overflow-hidden rounded-[2rem] ring-1 ring-fg/10 shadow-xl shadow-black/10 transition duration-500 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-black/20" :class="'aspect-[4/5]'">
      <img v-if="m.photo" :src="$img(m.photo)" :alt="m.name + ', ' + m.role" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" width="800" height="1000" loading="lazy">
      <template v-else>
        <div class="absolute inset-0 -z-10 bg-gradient-to-br" :class="tone" />
        <div class="absolute -top-16 -right-12 h-56 w-56 rounded-full bg-white/25 blur-3xl" aria-hidden="true" />
        <div class="absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-lime/30 blur-3xl" aria-hidden="true" />
        <svg class="absolute -right-6 -bottom-6 h-3/4 w-3/4 text-white/10" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20 180C20 100 70 30 180 20c0 80-50 150-160 160z"/><path d="M20 180C70 130 110 90 160 40M70 126c10-6 24-8 38-6M104 92c8-8 20-12 34-12"/></svg>
        <div class="absolute inset-0 grid place-items-center" :class="lead ? 'pb-28' : 'pb-24'" aria-hidden="true">
          <span class="serif text-white/85 drop-shadow-lg" :class="lead ? 'text-8xl sm:text-9xl' : 'text-6xl sm:text-7xl'">{{ initials }}</span>
        </div>
        <span class="glass absolute top-4 right-4 rounded-full px-3 py-1 text-[11px] font-semibold text-white">Photo coming soon</span>
      </template>

      <!-- name plate -->
      <div class="glass-plate absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3.5 text-white">
        <p class="text-[11px] font-bold uppercase tracking-[.2em] text-lime">{{ m.dept }}</p>
        <h3 class="mt-1 font-semibold leading-tight" :class="lead ? 'text-2xl' : 'text-xl'">{{ m.name }}</h3>
        <p class="text-sm text-white/85">{{ m.role }}</p>
      </div>
    </div>

    <!-- profile + contact -->
    <div class="px-2 pt-5">
      <p class="text-sm leading-relaxed" :class="m.bio ? 'text-fg/75' : 'text-fg/72 italic'">{{ m.bio || 'Full profile coming soon.' }}</p>
      <ul v-if="m.email || m.phone" class="mt-4 grid gap-1.5 text-sm font-medium">
        <li v-if="m.phone"><a :href="'tel:' + m.tel" class="text-accent hover:underline">{{ m.phone }}</a></li>
        <li v-if="m.email"><a :href="'mailto:' + m.email" class="text-accent hover:underline">{{ m.email }}</a></li>
      </ul>
      <div v-if="m.card" class="mt-4">
        <a :href="m.card" class="btn btn-dark">Digital card <span class="arr">↗</span></a>
      </div>
    </div>
  </article>
</template>
