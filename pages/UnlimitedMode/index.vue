<template lang="pug">
.page.unlimited-mode-page
  // Game Scene
  UnlimitedModeGameScene
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { UnlimitedModeGameScene } from '@/components/Scene'

export default defineComponent({
  components: {
    UnlimitedModeGameScene
  },
  layout: 'Default/Default.layout',
  setup() {}
})
</script>

<style lang="scss" src="./UnlimitedMode.page.scss"></style>
