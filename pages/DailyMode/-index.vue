<template lang="pug">
.page.daily-mode-page
  // Game Scene
  DailyModeGameScene
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { DailyModeGameScene } from '@/components/Scene'

export default defineComponent({
  components: {
    DailyModeGameScene
  },
  layout: 'Default/Default.layout',
  setup() {}
})
</script>

<style lang="scss" src="./DailyMode.page.scss"></style>
