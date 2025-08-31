<template lang="pug">
.login-form(:class="[loginFormVariantClass]")
  template(v-if="variant === 'default'")
    span.login-form__title Giriş Yap

    hr.login-form__separator

  .login-form__social-buttons
    Button.login-form__social-button.login-form__social-button--google(native-type="button" @click="handleGoogleLogin")
      AppIcon.login-form__social-button-icon(name="devicon:google" :width="20" :height="20")
      span.login-form__social-button-text Google ile Giriş Yap

    // Apple login button
      Button.login-form__social-button.login-form__social-button--apple(native-type="button" @click="handleAppleLogin")
        AppIcon.login-form__social-button-icon(name="devicon:apple" :width="20" :height="20")
        span.login-form__social-button-text Apple ile Giriş Yap
</template>

<script>
import { defineComponent, useContext, computed } from '@nuxtjs/composition-api'
import { Button } from 'vant'

export default defineComponent({
  components: {
    Button
  },
  props: {
    variant: {
      type: String,
      required: false,
      default: 'default' // default | full
    }
  },
  setup(props) {
    const context = useContext()

    const handleGoogleLogin = () => {
      console.log('Google login clicked')

      window.location.href = `${process.env.API_STRAPI}/connect/google`
    }

    const handleAppleLogin = () => {
      console.log('Apple login clicked')
    }

    const loginFormVariantClass = computed(() => {
      return {
        [`login-form--${props.variant}`]: props.variant
      }
    })

    return {
      handleGoogleLogin,
      handleAppleLogin,
      loginFormVariantClass
    }
  }
})
</script>

<style lang="scss" src="./LoginForm.component.scss"></style>
