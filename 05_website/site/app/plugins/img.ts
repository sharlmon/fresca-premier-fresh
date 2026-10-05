// Prefixes public-folder assets with the app's base URL so the site also works under a sub-path (e.g. GitHub Pages preview).
export default defineNuxtPlugin(() => {
  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  return { provide: { img: (p: string) => base + p } }
})
