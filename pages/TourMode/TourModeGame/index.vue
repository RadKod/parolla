<template lang="pug">
.page.tour-mode-game-page
  // Game Scene
  TourModeGameScene
</template>

<script>
import { defineComponent, useStore, onMounted, onBeforeUnmount } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'Default/Default.layout',
  setup() {
    // TODO: Implement this after tour mode socket channel is implemented
    /* const store = useStore()

    const setupWs = async () => {
      await store.dispatch('app/initWs')
      await store.dispatch('tour/listenWs', { ws: store.getters['app/ws'] })
    }

    const destroyWs = async () => {
      await store.dispatch('app/closeWs')
    }

    onMounted(async () => {
      await setupWs()
    })

    onBeforeUnmount(async () => {
      await destroyWs()
    }) */
  }
})
</script>

<style lang="scss" src="./TourModeGame.page.scss"></style>
