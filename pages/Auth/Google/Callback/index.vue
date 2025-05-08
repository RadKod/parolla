<template lang="pug">
.auth-google-callback-page
  p.text ...
</template>

<script lang="ts">
import { defineComponent, useStore, useContext, useRouter, onMounted } from '@nuxtjs/composition-api'
const { getQuery } = require('ufo')

export default defineComponent({
  name: 'AuthGoogleCallbackPage',
  layout: 'Default/Default.layout',
  setup() {
    const query = getQuery(window.location.href)
    const context = useContext()
    const store = useStore()
    const router = useRouter()

    const user = store.getters['auth/user']

    const runGoogleRegister = async () => {
      const result = await store.dispatch('auth/googleRegister', {
        code: query.code,
        state: query.state,
        fingerprint: user.fingerprint
      })

      await setGoogleUser({
        token: result.data.token,
        user: result.data.user
      })
    }

    const setGoogleUser = async ({ token, user }) => {
      await context.$auth.setStrategy('google')
      await context.$auth.setUserToken(token)

      store.commit('auth/SET_USER', user)

      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }

    onMounted(async () => {
      const redirectPath = context.$cookies.get('authNextRedirect')

      if (redirectPath) {
        await router.push(redirectPath)
      }

      runGoogleRegister()
    })
  }
})
</script>
