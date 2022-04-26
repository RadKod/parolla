<template lang="pug">
.app-logo(:class="`app-logo--${type}`")
  NuxtLink.app-logo-link(to="/" title="parolla")
    span.app-logo-title(v-if="type === 'title'") parolla
    .app-logo-circle(v-else :style="`width: ${width}px; height: ${height}px;`")
      span.app-logo-circle__letter(:style="`font-size: ${letterSize}px`") P
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    type: {
      type: String,
      required: false,
      default: 'default'
    },
    width: {
      type: Number,
      required: false,
      default: 128
    },
    height: {
      type: Number,
      required: false,
      default: 128
    },
    letterSize: {
      type: Number,
      required: false,
      default: 48
    }
  },
  setup() {}
})
</script>

<style lang="scss" src="./AppLogo.component.scss"></style>
