<template lang="pug">
.page.creator-mode-compose-page
  CreatorModeComposeForm
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { CreatorModeComposeForm } from '@/components/Form'

export default defineComponent({
  components: {
    CreatorModeComposeForm
  },
  layout: 'Default/Default.layout',
  setup() {}
})
</script>

<style lang="scss" src="./CreatorModeCompose.page.scss"></style>
