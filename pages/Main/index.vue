<template lang="pug">
.page.main-page
  h4 {{ envValue }}
  LazyIntroScene
</template>

<script>
import { defineComponent, useStore, onMounted } from '@nuxtjs/composition-api'
const { getQuery } = require('ufo')
import { Notify } from 'vant'

export default defineComponent({
  layout: 'Default/Default.layout',
  setup() {
    const query = getQuery(window.location.href)

    if (query.code) {
      window.history.pushState(null, null, window.location.pathname)

      setTimeout(() => {
        Notify({
          message: 'Login successful',
          color: 'var(--color-text-04)',
          background: 'var(--color-success-01)',
          duration: 1000
        })
      }, 1000)
    }

    const envValue = `GOOGLE_AUTH_REDIRECT_URI=${process.env.GOOGLE_AUTH_REDIRECT_URI}`

    console.log(envValue)

    return {
      envValue
    }
  }
})
</script>

<style lang="scss" src="./Main.page.scss"></style>
