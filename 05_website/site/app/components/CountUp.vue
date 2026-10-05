<script setup lang="ts">
// Counts up to a figure like "20+", "500+" or "100%" the first time it scrolls into view.
// The final value is in the server-rendered HTML, so it reads correctly without JavaScript,
// and the animation is skipped for reduced-motion and the accessibility menu's "still" option.
const props = defineProps<{ value: string }>()
const m = props.value.match(/^(\d+)(.*)$/)
const target = m ? Number(m[1]) : 0
const suffix = m ? m[2] : ''
const shown = ref(target)
const root = ref<HTMLElement>()

onMounted(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-still')
  if (!m || still || !('IntersectionObserver' in window)) return
  shown.value = 0
  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return
    io.disconnect()
    const start = performance.now()
    const run = (now: number) => {
      const t = Math.min(1, (now - start) / 1600)
      shown.value = Math.round(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) requestAnimationFrame(run)
    }
    requestAnimationFrame(run)
  }, { threshold: 0.6 })
  io.observe(root.value!)
})
</script>

<template>
  <span ref="root" class="relative inline-block tabular-nums">
    <span class="invisible" aria-hidden="true">{{ value }}</span>
    <span class="absolute inset-0 text-center" aria-hidden="true">{{ shown }}{{ suffix }}</span>
    <span class="sr-only">{{ value }}</span>
  </span>
</template>
