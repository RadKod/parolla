<template lang="pug">
.how-to-play-creator-mode-content
  i18n(tag="p" path="dialog.howToPlay.body")
    template(#description)
      div(v-html="$t('dialog.howToPlay.description')")
    template(#extra)
      <br>
      div(v-html="$t('dialog.howToPlay.creator.extra', { questionCount: String(alphabet.items.length) })")
</template>

<script>
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const store = useStore()

    const alphabet = computed(() => store.getters['creator/alphabet'])

    return {
      alphabet
    }
  }
})
</script>

<style lang="scss" src="./HowToPlayCreatorModeContent.component.scss"></style>
