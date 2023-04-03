<template lang="pug">
.page.creator-mode-intro-page
  .creator-mode-intro-page__inner
    p.creator-mode-intro-page__description
      strong Oyuncular tarafından oluşturulmuş soru-cevap setleri
      | &nbsp; <br> Hemen <strong>odalara bak</strong> ya da <strong>kendi soru-cevap setini oluştur</strong>
    .choose-list
      Button.choose-list-item(to="/creator/rooms" size="large")
        span.choose-list-item__icon 📢
        | ODALARA BAK
      Button.choose-list-item(to="/creator/compose" size="large")
        span.choose-list-item__icon ➕
        | ODA OLUŞTUR
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { Button } from 'vant'

export default defineComponent({
  components: {
    Button
  },
  layout: 'Default/Default.layout',
  setup() {}
})
</script>

<style lang="scss" src="./CreatorModeIntro.page.scss"></style>
