<template lang="pug">
.login-form
  span.login-form__title Giriş Yap

  hr.login-form__separator

  .login-form__social-buttons
    Button.login-form__social-button.login-form__social-button--google(native-type="button" @click="handleGoogleLogin")
      AppIcon.login-form__social-button-icon(name="devicon:google" :width="20" :height="20")
      span.login-form__social-button-text

    Button.login-form__social-button.login-form__social-button--apple(native-type="button" @click="handleAppleLogin")
      AppIcon.login-form__social-button-icon(name="devicon:apple" :width="20" :height="20")
      span.login-form__social-button-text
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { Form, Button, Field, Notify } from 'vant'

export default defineComponent({
  components: {
    Form,
    Button,
    Field,
    Notify
  },
  setup() {
    const handleGoogleLogin = () => {
      // Implement Google login logic here
      console.log('Google login clicked')
    }

    const handleAppleLogin = () => {
      // Implement Apple login logic here
      console.log('Apple login clicked')
    }

    return {
      handleGoogleLogin,
      handleAppleLogin
    }
  }
})
</script>

<style lang="scss" src="./LoginForm.component.scss"></style>
