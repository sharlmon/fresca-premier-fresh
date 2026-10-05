<script setup lang="ts">
usePageSeo({
  title: 'Accessibility statement',
  description: 'How Fresca Premier Fresh Ltd works to make its website usable by everyone, and how to tell us about a problem.',
})
</script>

<template>
  <div>
    <PageHero eyebrow="Accessibility" image="/img/stock/field-hills.webp" alt="" text="We want everyone to be able to use this website.">
      Accessibility <span class="serif font-normal">statement.</span>
    </PageHero>

    <article class="mx-auto max-w-3xl px-5 py-20 [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-semibold [&_h2]:mt-12 [&_h2]:mb-3 [&_p]:text-fg/75 [&_p]:leading-relaxed [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:grid [&_ul]:gap-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-fg/75 [&_a]:text-accent [&_a]:font-semibold [&_a]:underline [&_a]:[overflow-wrap:anywhere]">
      <p class="!mt-0">Fresca Premier Fresh Ltd wants this website to work for as many people as possible, including people who use screen readers, keyboards, magnification or high-contrast settings. We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1, level AA.</p>

      <h2>What we have done</h2>
      <ul>
        <li>The site can be used with a keyboard alone, with a visible focus outline and a “skip to main content” link.</li>
        <li>Pages use headings, landmarks, labelled form fields and text alternatives for meaningful images.</li>
        <li>The slideshow on the home page can be paused, and animations stop if your device is set to reduce motion.</li>
        <li>The site works in light and dark mode and adapts from small phones to large screens.</li>
      </ul>

      <h2>The accessibility button</h2>
      <p>The round button at the bottom left of every page opens a panel where you can enlarge text, switch to a high-contrast view, use a more readable font, increase text spacing, underline links, pause animations and enlarge the cursor. Your choices are saved in your own browser. They are not sent to us.</p>
      <p>These tools help, but they are not a substitute for a well-built page, which is why we also test the site itself with automated checks and by keyboard.</p>

      <h2>Known limitations</h2>
      <ul>
        <li>Some product and operations photographs show real working environments and may not have detailed descriptions.</li>
        <li>The downloadable company profile (PDF) is a designed brochure and is not fully tagged for screen readers. Its contents are also on the pages of this site.</li>
      </ul>

      <h2>Tell us about a problem</h2>
      <p>If you find something hard to use, or you need information in another format, please email <a href="mailto:info@frescapremierfresh.com">info@frescapremierfresh.com</a> or call +254 700 752 341. Tell us the page and what went wrong, and we will do our best to fix it or give you the information another way.</p>

      <p class="text-sm">This statement was written in October 2026 and will be reviewed whenever the website changes significantly.</p>
    </article>

    <CtaBand image="/img/stock/crop-rows.webp" />
  </div>
</template>
