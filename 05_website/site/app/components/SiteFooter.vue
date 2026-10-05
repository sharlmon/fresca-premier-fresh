<template>
  <footer class="px-4 pb-6 pt-10">
    <div class="glass mx-auto max-w-6xl rounded-[2rem]">
      <div class="px-7 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <img :src="$img('/img/logo.png')" alt="Fresca Premier Fresh" class="h-14 w-auto rounded-2xl bg-white/90 p-2" width="70" height="56">
          <p class="mt-4 text-sm leading-relaxed text-white/70">Premium Kenyan fresh vegetables, responsibly grown and carefully delivered to international markets.</p>
        </div>
        <div class="text-sm">
          <h3 class="text-white text-lg mb-3">Explore</h3>
          <ul class="grid gap-2 text-white/75">
            <li v-for="l in [['/about','About us'],['/products','Products'],['/quality','Quality & Safety'],['/sustainability','Sustainability'],['/team','Team'],['/contact','Contact']]" :key="l[0]"><NuxtLink :to="l[0]" class="hover:text-sun-400 transition">{{ l[1] }}</NuxtLink></li>
          </ul>
        </div>
        <div class="text-sm">
          <h3 class="text-white text-lg mb-3">Contact</h3>
          <address class="not-italic grid gap-2 text-white/75">
            <span>Trystar Go Down, Airport North Road<br>P.O. Box 3468-00200 Nairobi, Kenya</span>
            <a href="mailto:info@frescapremierfresh.com" class="hover:text-sun-400 transition">info@frescapremierfresh.com</a>
            <a href="tel:+254700752341" class="hover:text-sun-400 transition">+254 700 752 341</a>
          </address>
        </div>
      </div>
      <div class="border-t border-white/10 py-5 text-center text-xs text-white/50">© {{ new Date().getFullYear() }} Fresca Premier Fresh Ltd. All rights reserved.</div>
    </div>
  </footer>
</template>
