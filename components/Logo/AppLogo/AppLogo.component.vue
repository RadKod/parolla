<template lang="pug">
.app-logo
  NuxtLink.app-logo__link(to="/" title="parolla") parolla
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {}
})
</script>

<style lang="scss" src="./AppLogo.component.scss"></style>
