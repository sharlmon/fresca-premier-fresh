<script setup lang="ts">
// Visible breadcrumb trail (same data as the BreadcrumbList structured data). Sits on the dark hero panels, so it is light-on-dark.
const crumbs = useState<{ name: string; path: string }[]>('crumbs', () => [])
</script>

<template>
  <nav v-if="crumbs.length > 1" aria-label="Breadcrumb" class="text-sm text-white/80">
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
      <li v-for="(c, i) in crumbs" :key="c.path" class="flex items-center gap-2">
        <span v-if="i" aria-hidden="true" class="text-white/70">/</span>
        <span v-if="i === crumbs.length - 1" aria-current="page" class="font-semibold text-white">{{ c.name }}</span>
        <NuxtLink v-else :to="c.path" class="underline-offset-4 hover:text-lime hover:underline">{{ c.name }}</NuxtLink>
      </li>
    </ol>
  </nav>
</template>
