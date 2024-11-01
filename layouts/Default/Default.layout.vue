<template lang="pug">
.layout.default-layout
  // Preloader
  AppPreloader

  .layout__ad.layout__ad--left
    // image_vertical_flex_left
    AppAd(:data-ad-slot="2717771834")

  // Inner
  .layout__inner(:class="{ 'layout__inner--pulseBg': $route.path === localePath({ name: 'Main' }) }")
    img.layout__bg(src="img/core/pattern.svg" loading="lazy" alt="pattern" width="100%" height="100%")

    // App Header
    AppHeader

    // Layout Main
    main.layout__main
      // Router View
      nuxt.router-view

  .layout__ad.layout__ad--right
    // image_vertical_flex_right
    AppAd(:data-ad-slot="8500032812")
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {}
})
</script>

<style lang="scss" src="./Default.layout.scss"></style>
