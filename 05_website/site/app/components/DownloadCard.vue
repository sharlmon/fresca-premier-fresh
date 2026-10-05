<script setup lang="ts">
const { $img } = useNuxtApp()
</script>

<template>
  <section class="mx-auto max-w-6xl px-5 pt-24">
    <div class="reveal relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-forest text-white grid md:grid-cols-[auto_1fr_auto] gap-6 sm:gap-10 items-center p-6 sm:p-10">
      <div class="absolute -left-20 -bottom-24 h-64 w-64 rounded-full bg-leaf-500/30 blur-3xl" aria-hidden="true" />
      <img :src="$img('/img/profile-cover.webp')" alt="Cover of the Fresca Premier Fresh company profile" class="relative w-full max-w-[220px] rounded-2xl shadow-2xl shadow-black/40 -rotate-2" width="702" height="496" loading="lazy">
      <div class="relative">
        <span class="chip glass"><i />Company profile</span>
        <h2 class="mt-4 text-3xl sm:text-4xl font-semibold leading-tight">Take us <span class="serif font-normal">with you.</span></h2>
        <p class="mt-3 max-w-lg text-white/75 text-sm sm:text-base">Our products, standards and process in six pages, ready to share with your buying team. PDF, 5.7 MB.</p>
      </div>
      <a :href="$img('/downloads/Fresca-Premier-Fresh-Company-Profile.pdf')" download class="relative btn btn-lime">Download PDF <span class="arr">↓</span></a>
    </div>
  </section>
</template>
