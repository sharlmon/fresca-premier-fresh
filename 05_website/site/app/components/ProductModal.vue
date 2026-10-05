<script setup lang="ts">
import { tones, type Product } from '~/data/products'

const props = defineProps<{ product: Product; index: number; total: number }>()
const emit = defineEmits<{ close: []; prev: []; next: [] }>()
const { $img } = useNuxtApp()

const panel = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
const shot = ref(0)
watch(() => props.product.slug, () => (shot.value = 0))
const photo = computed(() => props.product.photos[shot.value])

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') { e.preventDefault(); emit('close'); return }
  if (e.key === 'ArrowRight') { emit('next'); return }
  if (e.key === 'ArrowLeft') { emit('prev'); return }
  if (e.key !== 'Tab' || !panel.value) return                  // keep keyboard focus inside the dialog
  const f = [...panel.value.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')]
  if (!f.length) return
  const first = f[0], last = f[f.length - 1]
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

// swipe left / right on touch screens to move between products
let x0 = 0
const touchStart = (e: TouchEvent) => { x0 = e.changedTouches[0].clientX }
const touchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - x0
  if (Math.abs(dx) > 70) emit(dx < 0 ? 'next' : 'prev')
}

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'           // lock page scroll behind the dialog
  document.addEventListener('keydown', onKey)
  nextTick(() => closeBtn.value?.focus())
})
onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[60] grid place-items-center p-3 sm:p-6" role="dialog" aria-modal="true" :aria-labelledby="'pm-title'">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="emit('close')" />

      <div ref="panel" class="pm-panel relative grid w-full max-w-5xl max-h-[94svh] overflow-hidden rounded-[2rem] bg-surface text-fg shadow-2xl shadow-black/50 md:grid-cols-[1.1fr_1fr]" @touchstart.passive="touchStart" @touchend.passive="touchEnd">
        <!-- visual -->
        <div class="relative isolate min-h-[260px] md:min-h-[520px]" :class="photo?.cutout ? 'bg-soft' : 'bg-forest'">
          <template v-if="photo">
            <img :key="photo.src" :src="$img(photo.src)" :alt="photo.alt" class="pm-img absolute inset-0 h-full w-full object-contain" :class="photo.cutout ? 'p-8 sm:p-12' : ''" width="1500" height="2000">
            <div v-if="product.photos.length > 1" class="absolute inset-x-0 bottom-3 flex justify-center gap-2" role="group" aria-label="Product photos">
              <button v-for="(ph, i) in product.photos" :key="ph.src" type="button" class="h-14 w-14 overflow-hidden rounded-xl ring-2 transition" :class="i === shot ? 'ring-lime' : 'ring-white/40 opacity-80 hover:opacity-100'" :aria-label="'Show photo ' + (i + 1) + ' of ' + product.photos.length" :aria-pressed="i === shot" @click="shot = i">
                <img :src="$img(ph.src)" alt="" class="h-full w-full object-cover" width="56" height="56">
              </button>
            </div>
          </template>
          <div v-else class="absolute inset-0 flex items-center justify-center bg-gradient-to-br" :class="tones[product.category]" aria-hidden="true">
            <span class="serif text-[10rem] leading-none opacity-90 sm:text-[14rem]">{{ product.name[0] }}</span>
          </div>
        </div>

        <!-- details -->
        <div class="flex min-h-0 flex-col overflow-y-auto p-6 sm:p-9">
          <div class="flex items-center justify-between gap-3">
            <span class="chip chip-soft"><i />{{ product.category }}</span>
            <button ref="closeBtn" type="button" class="grid h-11 w-11 place-items-center rounded-full bg-soft hover:bg-fg/10" aria-label="Close product view" @click="emit('close')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          <h2 id="pm-title" class="mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl">{{ product.name }}</h2>
          <p v-if="product.group === 'core'" class="mt-2 text-sm font-bold uppercase tracking-[.2em] text-accent">{{ product.tag }}</p>
          <p class="mt-5 leading-relaxed text-fg/80">{{ product.description }}</p>

          <dl v-if="product.facts.length" class="mt-6 grid gap-3">
            <div v-for="f in product.facts" :key="f.label" class="rounded-2xl border border-fg/10 bg-card px-4 py-3">
              <dt class="text-[11px] font-bold uppercase tracking-[.18em] text-accent">{{ f.label }}</dt>
              <dd class="mt-0.5 text-sm font-medium">{{ f.value }}</dd>
            </div>
          </dl>
          <p v-else class="mt-6 rounded-2xl bg-soft px-4 py-3 text-sm leading-relaxed">Volumes and availability vary through the year. Tell us what you need and we will confirm what is in season for your market.</p>

          <div class="mt-auto flex flex-wrap items-center gap-3 pt-8">
            <NuxtLink :to="{ path: '/contact/', query: { product: product.name } }" class="btn btn-dark">Request a quote <span class="arr">↗</span></NuxtLink>
            <div class="ml-auto flex items-center gap-2" role="group" aria-label="Browse products">
              <button type="button" class="grid h-11 w-11 place-items-center rounded-full border border-fg/20 hover:bg-soft" aria-label="Previous product" @click="emit('prev')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <span class="text-xs font-semibold tabular-nums text-fg/72" aria-live="polite">{{ index + 1 }} / {{ total }}</span>
              <button type="button" class="grid h-11 w-11 place-items-center rounded-full border border-fg/20 hover:bg-soft" aria-label="Next product" @click="emit('next')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
