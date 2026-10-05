<script setup lang="ts">
const { $img } = useNuxtApp()
const open = ref(false)
const scrolled = ref(false)
const overHero = computed(() => !scrolled.value && !open.value)
const route = useRoute()
const links = [
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/quality', label: 'Quality & Safety' },
  { to: '/sustainability', label: 'Sustainability' },
  { to: '/team', label: 'Team' },
]
onMounted(() => {
  const f = () => (scrolled.value = window.scrollY > 40)
  f(); window.addEventListener('scroll', f, { passive: true })
})
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4">
    <div class="mx-auto max-w-6xl rounded-full h-16 pl-3 pr-2 flex items-center justify-between transition-all duration-300"
         :class="overHero ? 'glass text-white' : 'bg-surface/85 backdrop-blur-xl text-fg shadow-lg shadow-black/10 border border-fg/10'">
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="Fresca Premier Fresh – home">
        <img :src="$img('/img/logo.png')" alt="" class="h-11 w-auto rounded-full bg-white p-1" width="52" height="40">
        <span class="font-semibold tracking-tight hidden sm:block">Fresca <span class="serif font-normal">Premier Fresh</span></span>
      </NuxtLink>
      <nav class="hidden lg:flex items-center gap-1 text-sm font-medium" aria-label="Main">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="rounded-full px-4 py-2 opacity-80 hover:opacity-100 transition" active-class="!opacity-100 font-semibold">{{ l.label }}</NuxtLink>
      </nav>
      <div class="flex items-center gap-1">
        <ThemeToggle />
        <NuxtLink to="/contact" class="btn btn-white hidden sm:inline-flex !py-1 !pr-1">Contact us <span class="arr">↗</span></NuxtLink>
        <button class="lg:hidden grid place-items-center h-10 w-10 rounded-full" :aria-expanded="open" aria-label="Menu" @click="open = !open">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path v-if="!open" d="M3 6h18M3 12h18M3 18h18"/><path v-else d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
    </div>
    <nav v-if="open" class="lg:hidden mx-auto max-w-6xl mt-2 rounded-3xl bg-surface text-fg p-5 grid gap-1 font-semibold shadow-xl border border-fg/10" aria-label="Mobile">
      <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="rounded-2xl px-4 py-3 hover:bg-soft">{{ l.label }}</NuxtLink>
      <NuxtLink to="/contact" class="btn btn-dark justify-between mt-2">Contact us <span class="arr">↗</span></NuxtLink>
    </nav>
  </header>
</template>
