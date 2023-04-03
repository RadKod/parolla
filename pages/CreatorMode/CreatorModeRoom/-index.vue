<template lang="pug">
.page.creator-mode-room-page
  h1 Creator Room Mode Page {{ $route.query.id }}
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'Default/Default.layout',
  setup() {}
})
</script>

<style lang="scss" src="./CreatorModeRoom.page.scss"></style>
