<template lang="pug">
.scene.intro-scene(ref="rootRef" tabindex="1")
  // Scene Inner
  .scene__inner
    AppLogo
    h2.intro-scene__title OYUN MODU SEÇ

    .intro-scene-mode-list
      Button.intro-scene-mode-list-item(to="/daily" size="large")
        span.intro-scene-mode-list-item__icon 📅
        | REKABETÇİ (GÜNLÜK)
      Button.intro-scene-mode-list-item(to="/unlimited" size="large")
        span.intro-scene-mode-list-item__icon 🔁
        | LİMİTSİZ
      Button.intro-scene-mode-list-item(to="/creator/start" size="large")
        span.intro-scene-mode-list-item__icon 📝
        | KENDİN OLUŞTUR
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { AppLogo } from '@/components/Logo'
import { Button } from 'vant'

export default defineComponent({
  components: {
    AppLogo,
    Button
  },
  setup() {}
})
</script>

<style lang="scss" src="./IntroScene.component.scss"></style>
