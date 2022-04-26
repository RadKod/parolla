<template lang="pug">
.page.home-page
  // Game Scene
  GameScene
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { GameScene } from '@/components/Scene'

export default defineComponent({
  components: {
    GameScene
  },
  layout: 'Default/Default.layout',
  setup() {}
})
</script>

<style lang="scss" src="./Home.page.scss"></style>
