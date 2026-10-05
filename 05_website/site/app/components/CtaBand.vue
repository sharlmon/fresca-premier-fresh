<script setup lang="ts">
const { $img } = useNuxtApp()
withDefaults(defineProps<{ image?: string }>(), { image: '/img/stock/farmer.jpg' })
</script>

<template>
  <section class="mx-3 sm:mx-4 mb-3 mt-24">
    <div class="reveal relative isolate overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-leaf-700">
      <img :src="$img(image)" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" width="2000" height="1335" loading="lazy">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-forest/95 via-forest/70 to-forest/20" />
      <div class="mx-auto max-w-6xl px-6 sm:px-10 py-20 sm:py-28 text-white">
        <h2 class="text-4xl sm:text-6xl font-semibold leading-[1.05] max-w-xl">Let’s grow <span class="serif font-normal">together.</span></h2>
        <p class="mt-5 max-w-md text-white/80">Tell us about your market requirements and we’ll respond quickly.</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <NuxtLink to="/contact" class="btn btn-lime">Request a quote <span class="arr">↗</span></NuxtLink>
          <a href="mailto:info@frescapremierfresh.com" class="btn btn-white">Email us <span class="arr">↗</span></a>
        </div>
      </div>
    </div>
  </section>
</template>
