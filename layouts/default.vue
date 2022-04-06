<template lang="pug">
.layout.default-layout
  // Preloader
  AppPreloader

  // Inner
  .layout__inner
    // App Header
    AppHeader

    // Layout Main
    main.layout__main
      // Router View
      nuxt.router-view
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { AppPreloader } from '@/components/Preloader'
import { AppHeader } from '@/components/Header'

export default defineComponent({
  components: {
    AppPreloader,
    AppHeader
  },
  setup() {}
})
</script>

<style lang="scss">
.default-layout {
  position: relative;
}
</style>
