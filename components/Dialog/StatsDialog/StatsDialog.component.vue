<template lang="pug">
Dialog.stats-dialog(
  v-model="state.isOpen"
  title="İstatistikler"
  cancel-button-text="Kapat"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
)
  // Scoreboard
  .scoreboard
    h3.scoreboard__title Skor Dağılımı
    .score
      span.score__icon 🟩
      span.score__count 12
      span.score__title Doğru

    .score
      span.score__icon 🟥
      span.score__count 8
      span.score__title Yanlış

    .score
      span.score__icon 🟨
      span.score__count 4
      span.score__title Pas

  // Actions
  .stats-dialog__actions
    // Next Game Countdown
    .countdown.stats-dialog__countdown
      span.countdown__title Sonraki Oyun
      Icon.countdown__icon(name="clock-o")
      CountDown.countdown__timer(ref="countdownTimerRef" format="HH:mm:ss" :auto-start="true" :time="9960000")

    // Result Sharer
    .result-sharer
      Button.result-sharer__button(color="var(--color-success-01)" icon="share-o" icon-position="right" round @click="shareResults") PAYLAŞ

  // Footer
  footer.stats-dialog__footer
    .d-flex
      RadKodLogo(:width="80" height="auto")
      span &nbsp;tarafından.
</template>

<script>
import { defineComponent, reactive, watch } from '@nuxtjs/composition-api'
import { Dialog, Icon, CountDown, Button, Toast } from 'vant'
import { RadKodLogo } from '@/components/Logo'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    Icon,
    CountDown,
    Button,
    RadKodLogo
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false
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

    const shareResults = async () => {
      const shareText = `
        Parolla - Günlük bilgi oyunu.

        🟩 12 Doğru
        🟥 8 Yanlış
        🟨 4 Pas

        https://parolla.app
      `
      try {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: 'Skorun Kopyalandı',
          position: 'bottom'
        })
        await navigator.share({
          title: 'Parolla',
          text: shareText,
          url: window.location
        })
      } catch {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: 'Skorun Kopyalandı',
          position: 'bottom'
        })
      }
    }

    return { state, shareResults }
  }
})
</script>

<style lang="scss" src="./StatsDialog.component.scss"></style>
