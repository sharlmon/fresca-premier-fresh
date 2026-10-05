<template>
  <footer class="px-3 sm:px-4 pb-4 pt-6">
    <div class="mx-auto max-w-7xl rounded-[2rem] sm:rounded-[2.5rem] bg-forest text-white border border-white/10">
      <div class="px-7 sm:px-12 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img :src="$img('/img/logo.png')" alt="Fresca Premier Fresh" class="h-16 w-auto rounded-2xl bg-white p-2" width="80" height="64">
          <p class="mt-5 max-w-sm text-sm leading-relaxed text-white/70">Premium Kenyan fresh vegetables, responsibly grown and carefully delivered to international markets.</p>
          <NuxtLink to="/contact" class="btn btn-lime mt-6">Request a quote <span class="arr">↗</span></NuxtLink>
        </div>
        <div class="text-sm">
          <h3 class="font-semibold text-white mb-4">Explore</h3>
          <ul class="grid gap-2.5 text-white/70">
            <li v-for="l in [['/about','About us'],['/products','Products'],['/quality','Quality & Safety'],['/sustainability','Sustainability'],['/team','Team'],['/contact','Contact']]" :key="l[0]"><NuxtLink :to="l[0]" class="hover:text-lime transition">{{ l[1] }}</NuxtLink></li>
          </ul>
        </div>
        <div class="text-sm">
          <h3 class="font-semibold text-white mb-4">Contact</h3>
          <address class="not-italic grid gap-2.5 text-white/70">
            <span>Trystar Go Down, Airport North Road<br>P.O. Box 3468-00200 Nairobi, Kenya</span>
            <a href="mailto:info@frescapremierfresh.com" class="hover:text-lime transition">info@frescapremierfresh.com</a>
            <a href="tel:+254700752341" class="hover:text-lime transition">+254 700 752 341</a>
          </address>
        </div>
      </div>
      <div class="border-t border-white/10 px-7 sm:px-12 py-5 text-xs text-white/50 flex flex-wrap justify-between gap-2">
        <span>© {{ new Date().getFullYear() }} Fresca Premier Fresh Ltd. All rights reserved.</span>
        <span>Quality · Reliability · Trust</span>
      </div>
    </div>
  </footer>
</template>
