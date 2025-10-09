<template lang="pug">
.page.creator-mode-compose-page
  CreatorModeComposeForm
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'Default/Default.layout',
  middleware: ['auth-control'],
  setup() {}
})
</script>

<style lang="scss" src="./CreatorModeCompose.page.scss"></style>
