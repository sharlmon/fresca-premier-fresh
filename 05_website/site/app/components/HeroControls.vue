<script setup lang="ts">
// Slide caption + pause + progress bars for the home hero. Rendered once for phones and once inside the photo frame on desktop.
defineProps<{ compact?: boolean; slides: { img: string; t: string; s: string; to: string }[]; cur: number; paused: boolean; still: boolean; dwell: number }>()
const emit = defineEmits<{ go: [i: number]; toggle: [] }>()
</script>

<template>
  <div class="glass-plate w-full rounded-[1.75rem] text-white" :class="compact ? 'p-3.5' : 'p-5'">
    <div class="flex items-center justify-between gap-4">
      <div class="min-w-0" :aria-live="paused || still ? 'polite' : 'off'" aria-atomic="true">
        <p v-if="!compact" class="text-[11px] font-bold uppercase tracking-[.2em] text-lime">Now showing</p>
        <p class="font-semibold leading-tight" :class="compact ? 'text-base' : 'mt-1 text-xl'">{{ slides[cur].t }}</p>
        <p v-if="!compact" class="mt-0.5 text-sm text-white/85">{{ slides[cur].s }}</p>
      </div>
      <NuxtLink :to="slides[cur].to" class="grid shrink-0 place-items-center rounded-full bg-white text-forest transition hover:rotate-45" :class="compact ? 'h-10 w-10' : 'h-11 w-11'" :aria-label="'View: ' + slides[cur].t">↗</NuxtLink>
    </div>
    <div class="flex items-center gap-3" :class="compact ? 'mt-3' : 'mt-4'">
      <button type="button" class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 transition hover:bg-white/35" :aria-label="paused ? 'Play slideshow' : 'Pause slideshow'" @click="emit('toggle')">
        <svg v-if="!(paused || still)" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="5" height="16" rx="1"/><rect x="14" y="4" width="5" height="16" rx="1"/></svg>
        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>
      </button>
      <div class="flex flex-1 gap-2" role="group" aria-label="Choose slide">
        <button v-for="(sl, i) in slides" :key="sl.img" type="button" class="hero-bar relative h-2 flex-1 overflow-hidden rounded-full bg-white/30" :aria-label="'Show slide ' + (i + 1) + ' of ' + slides.length + ': ' + sl.t" :aria-current="i === cur ? 'true' : undefined" @click="emit('go', i)">
          <span class="absolute inset-y-0 left-0 rounded-full bg-white" :class="i === cur ? (paused || still ? 'w-full' : 'hero-fill') : (i < cur ? 'w-full' : 'w-0')" :style="{ animationDuration: dwell + 'ms', animationPlayState: paused ? 'paused' : 'running' }" />
        </button>
      </div>
    </div>
  </div>
</template>
