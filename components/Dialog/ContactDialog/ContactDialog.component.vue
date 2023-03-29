<template lang="pug">
Dialog.dialog.contact-dialog(
  v-model="state.isOpen"
  title="Bize ulaşın"
  :cancel-button-text="cancelButtonText"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
  @opened="$emit('opened')"
)
  p.contact-dialog__description Öneri, şikayet ya da işbirliği için; <br><br>
    | <a href="mailto:info@radkod.com?subject=parolla_contact">info@radkod.com</a> <br> veya <br>
    a(href="https://twitter.com/parollaapp" target="_blank") @parollaapp <br>
    | twitter hesabımızdan ulaşabilirsin.
</template>

<script>
import { defineComponent, reactive, watch } from '@nuxtjs/composition-api'
import { Dialog } from 'vant'

export default defineComponent({
  components: {
    Dialog: Dialog.Component
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    cancelButtonText: {
      type: String,
      required: false,
      default: 'Kapat'
    }
  },
  setup(props) {
    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
      }
    )

    return { state }
  }
})
</script>

<style lang="scss" src="./ContactDialog.component.scss"></style>
