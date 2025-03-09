<template lang="pug">
.how-to-play-tour-mode-content
  i18n(tag="p" path="dialog.howToPlay.body")
    template(#extra)
      <br>
      div(v-html="$t('dialog.howToPlay.tour.extra')")
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {}
})
</script>

<style lang="scss" src="./HowToPlayTourModeContent.component.scss"></style>
