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
  ul.auth-dialog-list
    strong.auth-dialog-list__title {{ $t('auth.dialog.list.title') }}

    li.auth-dialog-list-item
      span.auth-dialog-list-item__title {{ $t('auth.dialog.list.item1.title') }}
    li.auth-dialog-list-item
      span.auth-dialog-list-item__title {{ $t('auth.dialog.list.item2.title') }}
    li.auth-dialog-list-item
      span.auth-dialog-list-item__title {{ $t('auth.dialog.list.item3.title') }}
    template(v-if="$i18n.locale === $i18n.defaultLocale")
      li.auth-dialog-list-item
        span.auth-dialog-list-item__title {{ $t('auth.dialog.list.item4.title') }}
      li.auth-dialog-list-item
        span.auth-dialog-list-item__title {{ $t('auth.dialog.list.item5.title') }}

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
