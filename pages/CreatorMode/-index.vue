<template lang="pug">
.page.creator-mode-page
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

<style lang="scss" src="./CreatorMode.page.scss"></style>
