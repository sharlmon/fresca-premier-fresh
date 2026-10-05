<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL
const route = useRoute()
const products = ['French beans', 'Snow peas / mangetout', 'Sugar snap peas', 'Baby corn', 'Avocados', 'Mangoes', 'Passion fruit', 'Carrots', 'Chillies', 'Herbs (rosemary, chives)']

const f = reactive({ name: '', company: '', email: '', phone: '', market: '', message: '', website: '' })
// chosen products -> optional quantity / frequency typed by the buyer
const picked = reactive<Record<string, string>>({})
const fromQuery = String(route.query.product || '').toLowerCase()
if (fromQuery) { const hit = products.find((p) => p.toLowerCase().includes(fromQuery)); if (hit) picked[hit] = '' }
const toggle = (p: string) => { if (p in picked) delete picked[p]; else picked[p] = '' }
const summary = computed(() => Object.entries(picked).map(([n, q]) => (q.trim() ? `${n} — ${q.trim()}` : n)).join('\n'))

const opened = Date.now()
const state = ref<'idle' | 'sending' | 'sent' | 'error' | 'offline'>('idle')
const err = ref('')
const mailto = computed(() => 'mailto:info@frescapremierfresh.com?subject=' + encodeURIComponent('Enquiry from ' + (f.name || 'website') + (f.company ? ' (' + f.company + ')' : '')) +
  '&body=' + encodeURIComponent(`Name: ${f.name}\nCompany: ${f.company}\nPhone: ${f.phone}\nDestination market: ${f.market}\n\nProducts:\n${summary.value || '-'}\n\n${f.message}`))

async function submit() {
  err.value = ''
  if (!f.name.trim()) { err.value = 'Please tell us your name.'; state.value = 'error'; return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { err.value = 'Please enter a valid email address.'; state.value = 'error'; return }
  if (!summary.value && f.message.trim().length < 5) { err.value = 'Please choose at least one product or write a short message.'; state.value = 'error'; return }
  state.value = 'sending'
  try {
    const body = new FormData()
    Object.entries(f).forEach(([k, v]) => body.append(k, v))
    body.append('products', summary.value)
    body.append('elapsed', String(Date.now() - opened))
    const res = await fetch(base + 'contact.php', { method: 'POST', body, headers: { Accept: 'application/json' } })
    const ct = res.headers.get('content-type') || ''
    if (res.status === 404 || res.status === 405 || !ct.includes('json')) { state.value = 'offline'; return }   // static preview: no PHP here
    const j = await res.json()
    if (typeof j.ok !== 'boolean') { state.value = 'offline'; return }       // not our script answering
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

    <form v-else class="rounded-[2rem] bg-card border border-fg/10 p-6 sm:p-9 grid gap-5" novalidate @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="grid gap-1.5 text-sm font-semibold">Name *<input v-model.trim="f.name" class="field font-normal" type="text" required maxlength="100" autocomplete="name" placeholder="Your name"></label>
        <label class="grid gap-1.5 text-sm font-semibold">Company<input v-model.trim="f.company" class="field font-normal" type="text" maxlength="120" autocomplete="organization" placeholder="Company name"></label>
        <label class="grid gap-1.5 text-sm font-semibold">Email *<input v-model.trim="f.email" class="field font-normal" type="email" required maxlength="150" autocomplete="email" placeholder="you@company.com"></label>
        <label class="grid gap-1.5 text-sm font-semibold">Phone / WhatsApp<input v-model.trim="f.phone" class="field font-normal" type="tel" maxlength="40" autocomplete="tel" placeholder="+44 …"></label>
      </div>

      <fieldset>
        <legend class="text-sm font-semibold">Products you’re interested in</legend>
        <p class="mt-1 text-xs text-fg/72">Choose as many as you like.</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <label v-for="p in products" :key="p" class="cursor-pointer">
            <input type="checkbox" class="peer sr-only" :checked="p in picked" @change="toggle(p)">
            <span class="inline-flex items-center gap-2 rounded-full border border-fg/20 bg-surface px-4 py-2 text-sm font-medium transition peer-checked:border-transparent peer-checked:bg-forest peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sun-400 dark:peer-checked:bg-lime dark:peer-checked:text-forest">
              <svg v-if="p in picked" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              {{ p }}
            </span>
          </label>
        </div>
        <div v-if="Object.keys(picked).length" class="mt-4 grid gap-3 sm:grid-cols-2">
          <label v-for="(_, p) in picked" :key="p" class="grid gap-1.5 text-sm font-semibold">{{ p }}: quantity or frequency
            <input v-model.trim="picked[p]" class="field font-normal" type="text" maxlength="80" placeholder="e.g. 2 tonnes per week">
          </label>
        </div>
      </fieldset>

      <label class="grid gap-1.5 text-sm font-semibold">Destination market<input v-model.trim="f.market" class="field font-normal" type="text" maxlength="120" placeholder="e.g. Netherlands, United Kingdom"></label>
      <label class="grid gap-1.5 text-sm font-semibold">Message<textarea v-model.trim="f.message" class="field font-normal" maxlength="3000" placeholder="Packaging, timing, anything else we should know…" /></label>
      <!-- honeypot: real visitors never see or fill this -->
      <input v-model="f.website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 opacity-0">

      <p v-if="state === 'error'" class="rounded-2xl bg-red-500/10 text-red-700 dark:text-red-300 px-4 py-3 text-sm" role="alert">{{ err }}</p>

      <div v-if="state === 'offline'" class="rounded-2xl bg-soft text-fg px-5 py-4 text-sm leading-relaxed" role="status">
        The form can’t send from this preview page. Your message is ready, so you can
        <a :href="mailto" class="font-semibold text-accent underline">send it by email instead</a>.
      </div>

      <p class="text-xs text-fg/72 leading-relaxed">By sending this message you agree that we may use your details to reply to you. See our <NuxtLink to="/privacy/" class="font-semibold text-accent underline">Privacy Policy</NuxtLink>.</p>

      <div class="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" class="btn btn-dark" :disabled="state === 'sending'">{{ state === 'sending' ? 'Sending…' : 'Send enquiry' }} <span class="arr">↗</span></button>
        <span class="text-xs text-fg/72">Or email <a href="mailto:info@frescapremierfresh.com" class="font-semibold text-accent hover:underline">info@frescapremierfresh.com</a></span>
      </div>
    </form>
  </div>
</template>
