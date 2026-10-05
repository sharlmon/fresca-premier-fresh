<script setup lang="ts">
import type { NuxtError } from '#app'
const props = defineProps<{ error: NuxtError }>()
const { $img } = useNuxtApp()
const is404 = computed(() => props.error?.statusCode === 404)
useHead({ title: is404.value ? 'Page not found' : 'Something went wrong', meta: [{ name: 'robots', content: 'noindex' }] })
const links = [['/', 'Home'], ['/products/', 'Our products'], ['/about/', 'About us'], ['/contact/', 'Contact us']]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface text-fg">
    <SiteHeader />
    <main class="flex-1">
      <section class="relative isolate mx-3 sm:mx-4 mt-3 sm:mt-4 overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] min-h-[88svh] flex items-center">
        <img :src="$img('/img/stock/crop-rows.webp')" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover" width="1920" height="1439">
        <div class="absolute inset-0 -z-10 bg-gradient-to-br from-forest/92 via-forest/75 to-forest/55" />
        <div class="mx-auto w-full max-w-6xl px-5 sm:px-8 pt-32 pb-16 text-white">
          <span class="chip glass"><i />{{ is404 ? 'Error 404' : 'Error ' + (error?.statusCode || '') }}</span>
          <h1 class="mt-6 text-5xl sm:text-7xl font-semibold leading-[1.02] max-w-3xl">
            {{ is404 ? 'This page' : 'Something' }} <span class="serif font-normal">{{ is404 ? 'has been picked.' : 'went wrong.' }}</span>
          </h1>
          <p class="mt-5 max-w-lg text-white/80 sm:text-lg">{{ is404 ? 'The page you are looking for has moved or no longer exists. Here are some good places to start.' : 'Please try again, or head back to the home page.' }}</p>
          <div class="mt-9 flex flex-wrap gap-3">
            <NuxtLink v-for="(l, i) in links" :key="l[0]" :to="l[0]" class="btn" :class="i === 0 ? 'btn-lime' : 'btn-white'">{{ l[1] }} <span class="arr">↗</span></NuxtLink>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>
