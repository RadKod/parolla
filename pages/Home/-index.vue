<template lang="pug">
.page.home-page
  h3 Intro
  p
    nuxt-link(to="/daily") Daily Mode
  p
    nuxt-link(to="/unlimited") Unlimited Mode
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'Default/Default.layout',
  setup() {}
})
</script>

<style lang="scss" src="./Home.page.scss"></style>
