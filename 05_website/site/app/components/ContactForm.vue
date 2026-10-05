<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL
const route = useRoute()
const products = ['French beans', 'Snow peas / mangetout', 'Sugar snap peas', 'Baby corn', 'Avocados', 'Mangoes', 'Passion fruit', 'Carrots', 'Chillies', 'Herbs (rosemary, chives)', 'Other / not sure']
const f = reactive({ name: '', company: '', email: '', phone: '', product: String(route.query.product || ''), message: '', website: '' })
const opened = Date.now()
const state = ref<'idle' | 'sending' | 'sent' | 'error' | 'offline'>('idle')
const err = ref('')
const mailto = computed(() => 'mailto:info@frescapremierfresh.com?subject=' + encodeURIComponent('Enquiry from ' + (f.name || 'website') + (f.company ? ' (' + f.company + ')' : '')) +
  '&body=' + encodeURIComponent(`Name: ${f.name}\nCompany: ${f.company}\nPhone: ${f.phone}\nProduct: ${f.product}\n\n${f.message}`))

async function submit() {
  err.value = ''
  state.value = 'sending'
  try {
    const body = new FormData()
    Object.entries(f).forEach(([k, v]) => body.append(k, v))
    body.append('elapsed', String(Date.now() - opened))
    const res = await fetch(base + 'contact.php', { method: 'POST', body, headers: { Accept: 'application/json' } })
    const ct = res.headers.get('content-type') || ''
    if (!ct.includes('json')) { state.value = 'offline'; return }          // static preview: no PHP here
    const j = await res.json()
    if (j.ok) { state.value = 'sent'; return }
    err.value = j.error || 'Something went wrong. Please try again.'
    state.value = 'error'
  } catch {
    state.value = 'offline'
  }
}
</script>

<template>
  <div>
    <div v-if="state === 'sent'" class="rounded-[2rem] bg-card border border-fg/10 p-10 text-center" role="status">
      <span class="icon-circle h-16 w-16 mx-auto"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
      <h3 class="mt-6 text-3xl font-semibold">Thank you, <span class="serif font-normal">message sent.</span></h3>
      <p class="mt-3 text-fg/70">We’ll get back to you shortly.</p>
    </div>

    <form v-else class="rounded-[2rem] bg-card border border-fg/10 p-6 sm:p-9 grid gap-4" novalidate @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="grid gap-1.5 text-sm font-semibold">Name *<input v-model.trim="f.name" class="field font-normal" type="text" required maxlength="100" autocomplete="name" placeholder="Your name"></label>
        <label class="grid gap-1.5 text-sm font-semibold">Company<input v-model.trim="f.company" class="field font-normal" type="text" maxlength="120" autocomplete="organization" placeholder="Company name"></label>
        <label class="grid gap-1.5 text-sm font-semibold">Email *<input v-model.trim="f.email" class="field font-normal" type="email" required maxlength="150" autocomplete="email" placeholder="you@company.com"></label>
        <label class="grid gap-1.5 text-sm font-semibold">Phone / WhatsApp<input v-model.trim="f.phone" class="field font-normal" type="tel" maxlength="40" autocomplete="tel" placeholder="+44 …"></label>
      </div>
      <label class="grid gap-1.5 text-sm font-semibold">Product of interest
        <select v-model="f.product" class="field font-normal"><option value="">Select a product</option><option v-for="p in products" :key="p">{{ p }}</option></select>
      </label>
      <label class="grid gap-1.5 text-sm font-semibold">Message *<textarea v-model.trim="f.message" class="field font-normal" required maxlength="3000" placeholder="Volumes, destination market, packaging, timing…" /></label>
      <!-- honeypot: real visitors never see or fill this -->
      <input v-model="f.website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 opacity-0">

      <p v-if="state === 'error'" class="rounded-2xl bg-red-500/10 text-red-600 dark:text-red-300 px-4 py-3 text-sm" role="alert">{{ err }}</p>

      <div v-if="state === 'offline'" class="rounded-2xl bg-soft text-fg px-5 py-4 text-sm leading-relaxed" role="status">
        The form can’t send from this preview page. Your message is ready, so you can
        <a :href="mailto" class="font-semibold text-accent underline">send it by email instead</a>.
      </div>

      <div class="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" class="btn btn-dark" :disabled="state === 'sending'">{{ state === 'sending' ? 'Sending…' : 'Send message' }} <span class="arr">↗</span></button>
        <span class="text-xs text-fg/55">Or email <a href="mailto:info@frescapremierfresh.com" class="font-semibold text-accent hover:underline">info@frescapremierfresh.com</a></span>
      </div>
    </form>
  </div>
</template>
