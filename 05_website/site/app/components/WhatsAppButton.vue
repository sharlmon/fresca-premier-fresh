<script setup lang="ts">
// Floating chat button. Number = the office line shown in the footer.
const msg = encodeURIComponent('Hello Fresca Premier Fresh, I would like to enquire about your fresh produce.')
const href = `https://wa.me/254700752341?text=${msg}`
</script>

<template>
  <a :href="href" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp"
     class="group fixed z-40 right-4 bottom-4 sm:right-6 sm:bottom-6 flex items-center gap-3 rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 pl-4 pr-4 sm:pr-5 h-14 hover:scale-105 transition"
     style="margin-bottom: env(safe-area-inset-bottom)">
    <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.56 4.19 1.62 6.01L4 28l7.1-1.86a12.02 12.02 0 0 0 4.94 1.06h.01C22.7 27.2 28 21.8 28 15.16 28 8.5 22.68 3 16.04 3zm0 22.1a9.94 9.94 0 0 1-5.07-1.39l-.36-.22-4.2 1.1 1.12-4.1-.24-.38a9.93 9.93 0 0 1-1.53-5.28c0-5.5 4.48-9.98 9.99-9.98 5.5 0 9.96 4.48 9.96 9.98 0 5.5-4.46 9.27-9.67 10.27zm5.47-7.47c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.25-.58-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.3 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z"/></svg>
    <span class="hidden sm:block text-sm font-semibold">Chat on WhatsApp</span>
  </a>
</template>
