<template lang="pug">
Dialog.dialog.how-to-play-dialog(
  v-model="state.isOpen"
  title="parolla Nasıl Oynanır?"
  :cancel-button-text="cancelButtonText"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
)
  .how-to-play-dialog__explain
    HowToPlayDailyModeContent(v-if="$route.name === 'DailyMode'")
    HowToPlayUnlimitedModeContent(v-if="$route.name === 'UnlimitedMode'")
    .how-to-play-dialog__ad
      AppAd(:data-ad-slot="9964323575")

  // Footer
  footer.how-to-play-dialog__footer
    .d-flex
      RadKodLogo(:width="80" height="auto")
      span &nbsp;tarafından.
</template>

<script>
import { defineComponent, reactive, watch } from '@nuxtjs/composition-api'
import { ALPHABET_LENGTH } from '@/system/constant'
import { Dialog } from 'vant'
import { HowToPlayDailyModeContent, HowToPlayUnlimitedModeContent } from '@/components/Content'
import { RadKodLogo } from '@/components/Logo'
import { AppAd } from '@/components/Ad'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    HowToPlayDailyModeContent,
    HowToPlayUnlimitedModeContent,
    RadKodLogo,
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
      default: 'Kapat ve Başla'
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

    return { ALPHABET_LENGTH, state }
  }
})
</script>

<style lang="scss" src="./HowToPlayDialog.component.scss"></style>
