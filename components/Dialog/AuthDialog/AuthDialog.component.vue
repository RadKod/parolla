<template lang="pug">
Dialog.dialog.auth-dialog(
  :value="isOpenAuthDialog"
  :title="$t('dialog.auth.title')"
  :cancel-button-text="cancelButtonText || $t('general.close')"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  :before-close="handleBeforeClose"
  @input="handleDialogInput"
  @closed="onClosed"
  @opened="$emit('opened')"
)
  img.auth-dialog__cover(src="/img/elements/loginwall.svg" draggable="false")

  ul.auth-dialog-list
    strong.auth-dialog-list__title Giriş yaparak

    li.auth-dialog-list-item
      span.auth-dialog-list-item__title Tur modunu oyna
    li.auth-dialog-list-item
      span.auth-dialog-list-item__title Kalıcı oyuncu adı al
    li.auth-dialog-list-item
      span.auth-dialog-list-item__title Sohbete katıl

  LoginForm(variant="full")
</template>

<script>
import { defineComponent, useContext, useStore, computed, watch } from '@nuxtjs/composition-api'
import { Dialog } from 'vant'

export default defineComponent({
  components: {
    Dialog: Dialog.Component
  },
  props: {
    cancelButtonText: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props) {
    const context = useContext()
    const store = useStore()
    const isOpenAuthDialog = computed(() => store.getters['auth/isOpenAuthDialog'])

    watch(
      () => isOpenAuthDialog.value,
      value => {
        if (value) {
          context.$cookies.set('authNextRedirect', context.route.value.fullPath)
        }
      }
    )

    const handleDialogInput = value => {
      if (!value) {
        store.commit('auth/SET_AUTH_DIALOG_IS_OPEN', false)
      }
    }

    const onClosed = () => {
      store.commit('auth/SET_AUTH_DIALOG_IS_OPEN', false)
    }

    const handleBeforeClose = (action, done) => {
      store.commit('auth/SET_AUTH_DIALOG_IS_OPEN', false)
      done()
    }

    return {
      isOpenAuthDialog,
      handleDialogInput,
      onClosed,
      handleBeforeClose
    }
  }
})
</script>

<style lang="scss" src="./AuthDialog.component.scss"></style>
