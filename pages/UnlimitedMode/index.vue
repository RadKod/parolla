<template lang="pug">
.page.unlimited-mode-page
  // Game Scene
  UnlimitedModeGameScene
</template>

<script>
import { defineComponent, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'Default/Default.layout',
  setup() {
    const { i18n, redirect, localePath } = useContext()

    if (i18n.locale !== i18n.defaultLocale) {
      redirect(localePath({ name: 'Main' }))
    }
  }
})
</script>

<style lang="scss" src="./UnlimitedMode.page.scss"></style>
