<script setup lang="ts">
type Prefs = { size: number; spacing: boolean; font: boolean; contrast: boolean; links: boolean; still: boolean; cursor: boolean }
const KEY = 'a11y'
const defaults = (): Prefs => ({ size: 0, spacing: false, font: false, contrast: false, links: false, still: false, cursor: false })

const prefs = reactive<Prefs>(defaults())
const open = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)

const toggles: { key: Exclude<keyof Prefs, 'size'>; label: string; hint: string }[] = [
  { key: 'contrast', label: 'High contrast', hint: 'Black background, white and yellow text' },
  { key: 'font', label: 'Readable font', hint: 'A clear typeface designed for low vision' },
  { key: 'spacing', label: 'Text spacing', hint: 'More space between letters, words and lines' },
  { key: 'links', label: 'Highlight links', hint: 'Underline every link' },
  { key: 'still', label: 'Pause animations', hint: 'Stops motion, fades and the slideshow' },
  { key: 'cursor', label: 'Large cursor', hint: 'A bigger mouse pointer' },
]

function apply() {
  const h = document.documentElement
  ;[0, 1, 2, 3].forEach((n) => h.classList.toggle('a11y-text-' + n, prefs.size === n && n > 0))
  ;(['spacing', 'font', 'contrast', 'links', 'still', 'cursor'] as const).forEach((k) => h.classList.toggle('a11y-' + k, prefs[k]))
  try {
    const any = prefs.size > 0 || toggles.some((t) => prefs[t.key])
    any ? localStorage.setItem(KEY, JSON.stringify(prefs)) : localStorage.removeItem(KEY)
  } catch {}
}
const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => { prefs[k] = v; apply() }
const reset = () => { Object.assign(prefs, defaults()); apply() }
const changed = computed(() => prefs.size > 0 || toggles.some((t) => prefs[t.key]))
const sizes = ['Default', 'Large', 'Larger', 'Largest']

function close(refocus = true) { open.value = false; if (refocus) nextTick(() => trigger.value?.focus()) }
async function toggleOpen() {
  open.value = !open.value
  if (open.value) { await nextTick(); panel.value?.querySelector<HTMLElement>('button, [href]')?.focus() }
}
function onKey(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') { e.preventDefault(); close() }
  if (e.key === 'Tab' && panel.value) {                         // keep keyboard focus inside the open panel
    const f = [...panel.value.querySelectorAll<HTMLElement>('button, [href]')]
    if (!f.length) return
    const first = f[0], last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}
function onOutside(e: PointerEvent) {
  if (open.value && panel.value && !panel.value.contains(e.target as Node) && !trigger.value?.contains(e.target as Node)) close(false)
}
onMounted(() => {
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || '{}')) } catch {}
  apply()
  document.addEventListener('keydown', onKey)
  document.addEventListener('pointerdown', onOutside)
})
onBeforeUnmount(() => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onOutside) })
</script>

<template>
  <div class="fixed z-40 left-4 bottom-4 sm:left-6 sm:bottom-6" style="margin-bottom: env(safe-area-inset-bottom)">
    <button ref="trigger" type="button" class="group relative grid place-items-center h-14 w-14 rounded-full bg-forest text-white ring-2 ring-white/70 shadow-xl shadow-black/25 hover:scale-110 transition" aria-label="Accessibility options" :aria-expanded="open" aria-controls="a11y-panel" @click="toggleOpen">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4.2" r="2.2"/><path d="M4 8.2c0-.6.5-1 1.1-1l13.8.01c.6 0 1.1.5 1.1 1 0 .6-.5 1.1-1.1 1.1L14 9.3v3.1l2.1 7.2c.2.6-.2 1.2-.8 1.4-.6.2-1.2-.1-1.4-.7L12 14.9l-1.9 6.4c-.2.6-.8.9-1.4.7-.6-.2-1-.8-.8-1.4l2.1-7.2V9.3l-4.9.01C4.5 9.3 4 8.8 4 8.2z"/></svg>
      <span aria-hidden="true" class="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-full bg-forest text-white text-sm font-semibold px-4 py-2.5 shadow-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition duration-200" :class="open ? '!hidden' : ''">Accessibility</span>
    </button>

    <div v-if="open" id="a11y-panel" ref="panel" role="dialog" aria-label="Accessibility options" class="absolute bottom-[4.5rem] left-0 w-[min(92vw,22rem)] max-h-[75svh] overflow-y-auto rounded-3xl bg-surface text-fg border border-fg/15 shadow-2xl shadow-black/30 p-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Accessibility</h2>
        <button type="button" class="grid place-items-center h-9 w-9 rounded-full hover:bg-soft" aria-label="Close accessibility options" @click="close()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>

      <div class="mt-4" role="group" aria-labelledby="a11y-size">
        <p id="a11y-size" class="text-sm font-semibold">Text size: <span class="text-accent">{{ sizes[prefs.size] }}</span></p>
        <div class="mt-2 grid grid-cols-3 gap-2">
          <button type="button" class="rounded-xl bg-soft py-2.5 font-semibold disabled:opacity-40" :disabled="prefs.size === 0" aria-label="Decrease text size" @click="set('size', prefs.size - 1)">A−</button>
          <button type="button" class="rounded-xl bg-soft py-2.5 text-sm font-semibold disabled:opacity-40" :disabled="prefs.size === 0" @click="set('size', 0)">Reset</button>
          <button type="button" class="rounded-xl bg-soft py-2.5 text-lg font-semibold disabled:opacity-40" :disabled="prefs.size === 3" aria-label="Increase text size" @click="set('size', prefs.size + 1)">A+</button>
        </div>
      </div>

      <ul class="mt-4 grid gap-2">
        <li v-for="t in toggles" :key="t.key">
          <button type="button" role="switch" :aria-checked="prefs[t.key]" class="w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition" :class="prefs[t.key] ? 'border-accent bg-soft' : 'border-fg/15'" @click="set(t.key, !prefs[t.key])">
            <span><span class="block text-sm font-semibold">{{ t.label }}</span><span class="block text-xs text-fg/65">{{ t.hint }}</span></span>
            <span aria-hidden="true" class="relative h-6 w-11 shrink-0 rounded-full transition" :class="prefs[t.key] ? 'bg-accent' : 'bg-fg/25'">
              <span class="absolute top-0.5 h-5 w-5 rounded-full bg-surface transition-all" :class="prefs[t.key] ? 'left-[22px]' : 'left-0.5'" />
            </span>
          </button>
        </li>
      </ul>

      <div class="mt-4 flex items-center justify-between gap-3">
        <button type="button" class="rounded-full border border-fg/25 px-4 py-2 text-sm font-semibold disabled:opacity-40" :disabled="!changed" @click="reset">Reset all</button>
        <NuxtLink to="/accessibility/" class="text-sm font-semibold text-accent underline" @click="close(false)">Accessibility statement</NuxtLink>
      </div>
    </div>
  </div>
</template>
