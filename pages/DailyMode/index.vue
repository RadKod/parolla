<template lang="pug">
.page.daily-mode-page
  // Game Scene
  DailyModeGameScene
</template>

<script>
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { DailyModeGameScene } from '@/components/Scene'

export default defineComponent({
  components: {
    DailyModeGameScene
  },
  layout: 'Default/Default.layout',
  setup() {
    const { i18n, redirect, localePath } = useContext()

    if (i18n.locale !== i18n.defaultLocale) {
      redirect(localePath({ name: 'Main' }))
    }
  }
})
</script>

<style lang="scss" src="./DailyMode.page.scss"></style>
