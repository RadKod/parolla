<template lang="pug">
Dialog.dialog.credits-dialog(
  v-model="state.isOpen"
  title="Yapımcılar"
  :cancel-button-text="cancelButtonText"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
  @opened="$emit('opened')"
)
  p <strong>parolla</strong> açık kaynak bir projedir.
    | &nbsp;<a href="https://github.com/RadKod/parolla" title="parolla Github" target="_blank">GitHub</a> bağlantısından ulaşabilirsin.

  span.credits-dialog__person
    | Planlama ve Arayüz
    a(href="https://twitter.com/selimdoyranli" target="_blank") @selimdoyranli

  span.credits-dialog__person
    | Arkaplan ve Veri Tabanı
    a(href="https://twitter.com/apo_bozdag" target="_blank") @apo_bozdag
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

<style lang="scss" src="./CreditsDialog.component.scss"></style>
