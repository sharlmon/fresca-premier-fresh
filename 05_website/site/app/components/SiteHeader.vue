<script setup lang="ts">
const open = ref(false)
const links = [
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/quality', label: 'Quality & Safety' },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/team', label: 'Team' },
]
const route = useRoute()
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <header class="sticky top-0 z-40 px-4 pt-4">
    <div class="glass-strong mx-auto max-w-6xl rounded-full pl-4 pr-3 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="Fresca Premier Fresh – home">
        <img :src="$img('/img/logo.png')" alt="" class="h-10 w-auto rounded-full bg-white/90 p-1" width="52" height="40">
        <span class="font-display text-lg text-white hidden sm:block">Fresca Premier Fresh</span>
      </NuxtLink>
      <nav class="hidden lg:flex items-center gap-1 text-sm font-semibold">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="rounded-full px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition" active-class="!text-white bg-white/15">{{ l.label }}</NuxtLink>
        <NuxtLink to="/contact" class="btn btn-sun !py-2 !px-5 ml-2">Contact</NuxtLink>
      </nav>
      <button class="lg:hidden p-2.5 rounded-full text-white hover:bg-white/10" :aria-expanded="open" aria-label="Menu" @click="open = !open">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path v-if="!open" d="M3 6h18M3 12h18M3 18h18"/><path v-else d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <nav v-if="open" class="glass-strong lg:hidden mx-auto max-w-6xl mt-2 rounded-3xl p-5 grid gap-1 font-semibold text-white">
      <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="rounded-2xl px-4 py-3 hover:bg-white/10">{{ l.label }}</NuxtLink>
      <NuxtLink to="/contact" class="btn btn-sun justify-center mt-2">Contact</NuxtLink>
    </nav>
  </header>
</template>
