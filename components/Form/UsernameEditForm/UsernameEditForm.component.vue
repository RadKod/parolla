<template lang="pug">
Form.username-edit-form(@keypress.enter.prevent @failed="handleFailed")
  Field.username-edit-form__usernameField(maxlength="28" :disabled="form.isBusy")
    template(#label)
      .username-edit-form__label
        Badge.username-edit-form__avatarBadge(v-if="!$auth.loggedIn" type="primary" content="Ziyaretçi")
        PlayerAvatar(:size="36" :name="user.fingerprint")

    template(#input)
      input(
        name="username"
        :value="user.username"
        :placeholder="$t('form.usernameEdit.usernameField.placeholder')"
        rows="1"
        maxlength="28"
        autocomplete="off"
        :disabled="form.isBusy"
        @input="e => handleUsernameInput(e)"
      )
      Button.username-edit-form-submit-button(
        native-type="button"
        :loading="form.isBusy"
        :disabled="form.isBusy || !isUsernameChanged"
        @click="handleSubmit"
      )
        AppIcon.username-edit-form-submit-button__icon(name="tabler:check" color="var(--color-text-04)" :width="20" :height="20")
        span.username-edit-form-submit-button__title
</template>

<script>
import { defineComponent, useContext, useStore, reactive, computed } from '@nuxtjs/composition-api'
import { Form, Button, Field, Notify, Badge } from 'vant'

export default defineComponent({
  components: {
    Form,
    Button,
    Field,
    Notify,
    Badge
  },
  setup() {
    const { i18n } = useContext()
    const store = useStore()

    const user = computed(() => store.getters['auth/user'])

    const form = reactive({
      isBusy: false,
      isClear: false,
      username: user.value.username
    })

    const isUsernameChanged = computed(() => {
      return form.username !== user.value.username
    })

    const handleUsernameInput = e => {
      const value = e.target.value

      const regex = /^. {0,27}\S.+$/

      if (regex.test(value)) {
        form.isClear = true
      } else {
        form.isClear = false
      }

      form.username = value
    }

    const handleFailed = errorInfo => {
      if (errorInfo && errorInfo.values.length > 0) {
        form.isClear = false
      } else {
        form.isClear = true
      }
    }

    const handleSubmit = async () => {
      form.isBusy = true

      if (form.isClear) {
        const result = await store.dispatch('auth/updateUser', form.username)

        if (result.success) {
          store.commit('auth/SET_USERNAME', result.data.username)

          Notify({
            message: i18n.t('form.usernameEdit.callback.success'),
            color: 'var(--color-text-04)',
            background: 'var(--color-success-01)',
            duration: 1000
          })
        } else {
          Notify({
            message: result.data.error,
            color: 'var(--color-text-04)',
            background: 'var(--color-danger-01)',
            duration: 1000
          })
        }
      } else {
        Notify({
          message: i18n.t('form.usernameEdit.error.submit'),
          color: 'var(--color-text-04)',
          background: 'var(--color-danger-01)',
          duration: 1000
        })
      }

      form.isBusy = false
    }

    return {
      user,
      form,
      isUsernameChanged,
      handleUsernameInput,
      handleFailed,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" src="./UsernameEditForm.component.scss"></style>
