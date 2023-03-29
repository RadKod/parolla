<template lang="pug">
.page.home-page
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

<style lang="scss" src="./Home.page.scss"></style>
