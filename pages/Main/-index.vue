<template lang="pug">
.page.main-page
  IntroScene
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { IntroScene } from '@/components/Scene'

export default defineComponent({
  components: {
    IntroScene
  },
  layout: 'Default/Default.layout',
  setup() {}
})
</script>

<style lang="scss" src="./Main.page.scss"></style>
