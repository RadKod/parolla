<template lang="pug">
.page.creator-mode-intro-page
  .creator-mode-intro-page__inner
    p.creator-mode-intro-page__description(v-html="$t('creatorModeIntro.description')")
    .choose-list
      Button.choose-list-item(size="large" :to="localePath({ name: 'CreatorMode-CreatorModeRooms' })")
        span.choose-list-item__icon 📢
        | {{ $t('creatorModeIntro.list.rooms.title') }}
      Button.choose-list-item(size="large" :to="localePath({ name: 'CreatorMode-CreatorModeCompose' })")
        span.choose-list-item__icon ➕
        | {{ $t('creatorModeIntro.list.compose.title') }}
      Button.choose-list-item(size="large" :to="localePath({ name: 'CreatorMode-CreatorModeMyRooms' })")
        span.choose-list-item__icon 📌
        | {{ $t('creatorModeIntro.list.myRooms.title') }}
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
