<template lang="pug">
.auth-google-callback-page
  p {{ $t('auth.google.callback.redirecting') }}
  small(v-html="$t('auth.google.callback.ifNoRedirect')")
</template>

<script lang="ts">
import { defineComponent, useStore, useContext, onMounted } from '@nuxtjs/composition-api'
import { Notify } from 'vant'
const { getQuery } = require('ufo')

export default defineComponent({
  name: 'AuthGoogleCallbackPage',
  layout: 'Default/Default.layout',
  setup() {
    const query = getQuery(window.location.href)
    const context = useContext()
    const store = useStore()

    const user = store.getters['auth/user']

    const runGoogleRegister = async () => {
      const result = await store.dispatch('auth/googleRegister', {
        code: query.code,
        state: query.state,
        fingerprint: user.fingerprint
      })

      if (result.success) {
        await setGoogleUser({
          token: result.data.token,
          user: result.data.user
        })
      } else {
        console.error(result)

        Notify({
          message: `${context.i18n.t('auth.error.title')}: ${result.message}`,
          color: 'var(--color-text-04)',
          background: 'var(--color-danger-01)',
          duration: 5000
        })

        setTimeout(() => {
          window.location.href = '/'
        }, 5000)
      }
    }

    const setGoogleUser = async ({ token, user }) => {
      await context.$auth.setStrategy('google')
      await context.$auth.setUserToken(token)

      store.commit('auth/SET_USER', user)

      const redirectPath = context.$cookies.get('authNextRedirect')

      setTimeout(() => {
        window.location.href = redirectPath || '/'
      }, 1000)
    }

    onMounted(() => {
      runGoogleRegister()
    })
  }
})
</script>

<style lang="scss" src="./AuthGoogleCallback.page.scss"></style>
