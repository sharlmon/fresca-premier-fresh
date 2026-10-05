<script setup lang="ts">
const dark = ref(false)
onMounted(() => { dark.value = document.documentElement.classList.contains('dark') })
const toggle = () => {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
  try { localStorage.setItem('theme', dark.value ? 'dark' : 'light') } catch {}
}
</script>

<template>
  <button type="button" class="grid place-items-center h-10 w-10 rounded-full transition hover:bg-white/15 dark:hover:bg-white/10" :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'" :aria-pressed="dark" @click="toggle">
    <svg v-if="!dark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
  </button>
</template>
