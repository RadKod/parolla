<template lang="pug">
.layout.default-layout
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
import { AppHeader } from '@/components/Header'

export default defineComponent({
  components: {
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
