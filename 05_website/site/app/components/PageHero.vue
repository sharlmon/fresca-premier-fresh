<script setup lang="ts">
const { $img } = useNuxtApp()
defineProps<{ eyebrow: string; image: string; alt?: string; text?: string; pos?: string }>()
</script>

<template>
  <section class="relative isolate mx-3 sm:mx-4 mt-3 sm:mt-4 overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] min-h-[420px] sm:min-h-[500px] flex items-end">
    <img :src="$img(image)" :alt="alt || ''" class="absolute inset-0 -z-20 h-full w-full object-cover" :style="{ objectPosition: pos || 'center' }" width="2000" height="1200" fetchpriority="high">
    <div class="absolute inset-0 -z-10 bg-gradient-to-r from-forest/75 via-forest/35 to-transparent" />
    <div class="absolute inset-0 -z-10 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />
    <div class="mx-auto w-full max-w-6xl px-5 sm:px-8 pt-32 pb-10 sm:pb-14 text-white">
      <span class="chip glass"><i />{{ eyebrow }}</span>
      <h1 class="mt-5 max-w-3xl text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.04]"><slot /></h1>
      <p v-if="text" class="mt-5 max-w-xl text-white/85 sm:text-lg">{{ text }}</p>
    </div>
  </section>
</template>
