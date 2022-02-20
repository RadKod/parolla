<template lang="pug">
.app-header
  AppLogo
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { AppLogo } from '@/components/Logo'

export default defineComponent({
  components: {
    AppLogo
  },
  setup() {}
})
</script>

<style lang="scss" src="./AppHeader.component.scss"></style>
