<template lang="pug">
.layout.default-layout
  // Preloader
  AppPreloader

  .layout__ad.layout__ad--left
    // image_vertical_flex_left
    AppAd(:data-ad-slot="2717771834")

  // Inner
  .layout__inner(:class="{ 'layout__inner--pulseBg': $route.path === localePath({ name: 'Main' }) }")
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
import { AppPreloader } from '@/components/Preloader'
import { AppHeader } from '@/components/Header'
import { AppAd } from '@/components/Ad'

export default defineComponent({
  components: {
    AppPreloader,
    AppHeader,
    AppAd
  },
  setup() {}
})
</script>

<style lang="scss" src="./Default.layout.scss"></style>
