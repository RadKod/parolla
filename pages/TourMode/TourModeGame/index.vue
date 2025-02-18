<template lang="pug">
.page.tour-mode-game-page
  // Game Scene
  TourModeGameScene
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'Default/Default.layout',
  setup() {}
})
</script>

<style lang="scss" src="./TourModeGame.page.scss"></style>
