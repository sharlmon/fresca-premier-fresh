<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')

// fade sections in as they scroll into view
onMounted(() => {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.12 })
  const scan = () => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el))
  scan()
  useRouter().afterEach(() => nextTick(scan))
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <SiteHeader />
    <main class="flex-1" :class="isHome ? '' : 'pt-24'"><NuxtPage /></main>
    <SiteFooter />
  </div>
</template>
