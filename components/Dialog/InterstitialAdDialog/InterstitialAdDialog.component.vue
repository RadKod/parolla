<template lang="pug">
Dialog.dialog.interstitial-ad-dialog(
  v-model="state.isOpen"
  :title="$t('dialog.interstitialAd.title')"
  :cancel-button-text="`${cancelButtonText} (${countdownSecond})`"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
  @opened="$emit('opened')"
)
  .interstitial-ad-dialog__ad
    AppAd(:data-ad-slot="7758986158")
</template>

<script>
import { defineComponent, reactive, ref, watch } from '@nuxtjs/composition-api'
import { Dialog } from 'vant'
import { AppAd } from '@/components/Ad'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    AppAd
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
      default: null
    }
  },
  setup(props) {
    const state = reactive({
      isOpen: props.isOpen
    })

    const countdownSecond = ref(5)

    const startCountdown = () => {
      const interval = setInterval(() => {
        countdownSecond.value -= 1
      }, 1000)

      setTimeout(() => {
        state.isOpen = false
        clearInterval(interval)
      }, countdownSecond.value * 1000)
    }

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value

        if (value) {
          startCountdown()
        }
      }
    )

    return { state, countdownSecond }
  }
})
</script>

<style lang="scss" src="./InterstitialAdDialog.component.scss"></style>
