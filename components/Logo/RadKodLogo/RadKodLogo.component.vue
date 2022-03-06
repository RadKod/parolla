<template lang="pug">
a.radkod-logo(href="https://radkod.com" title="RadKod" :style="`width: ${width}px; height: ${height}`" target="_blank")
  img.radkod-logo__image(src="@/assets/img/core/radkod-logo-full.png" alt="RadKod" :width="width" :height="height")
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    width: {
      type: [Number, String],
      required: false,
      default: 160
    },
    height: {
      type: [Number, String],
      required: false,
      default: 40
    }
  },
  setup() {}
})
</script>

<style lang="scss" src="./RadKodLogo.component.scss"></style>
