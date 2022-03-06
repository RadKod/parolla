<template lang="pug">
.page.score-page
  h1 Score
</template>

<script>
import { defineComponent, onMounted, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const store = useStore()

    onMounted(() => {
      setTimeout(() => {
        store.commit('game/SET_IS_GAME_OVER', {
          isGameOver: false
        })
      }, 3000)
    })
  }
})
</script>
