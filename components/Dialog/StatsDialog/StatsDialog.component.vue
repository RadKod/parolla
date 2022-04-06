<template lang="pug">
Dialog.stats-dialog(
  v-model="state.isOpen"
  title="Bugünün İstatistiği"
  cancel-button-text="Kapat"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
)
  template(v-if="isGameOver")
    // Tabs
    Tabs.stats-dialog__tabs(v-model="activeTab")
      // Score Tab
      Tab(name="score" title="Skor")
        // Scoreboard
        .scoreboard
          h3.scoreboard__title Skor Dağılımı
          .score
            span.score__icon 🟩
            span.score__count {{ correctAnswers.length }}
            span.score__title Doğru

          .score
            span.score__icon 🟥
            span.score__count {{ wrongAnswers.length }}
            span.score__title Yanlış

          .score
            span.score__icon 🟨
            span.score__count {{ passedAnswers.length }}
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
      Tab(name="answers" title="Cevap Anahtarı")
        .answers
          CellGroup.answers__inner
            Cell.answers__answer(v-for="question in questions" :key="question.letter" :value="question.letter" :title="question.answer")

    // Footer
    footer.stats-dialog__footer
      .d-flex
        RadKodLogo(:width="80" height="auto")
        span &nbsp;tarafından.

  template(v-else)
    Empty.stats-dialog-empty
      p.stats-dialog-empty__title Oyun bittiğinde <br> istatistik burada görünecek.
</template>

<script>
import { defineComponent, ref, reactive, watch, computed, useStore } from '@nuxtjs/composition-api'
import { Dialog, Tabs, Tab, Icon, CountDown, Button, Toast, CellGroup, Cell, Empty } from 'vant'
import { RadKodLogo } from '@/components/Logo'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    Tabs,
    Tab,
    Icon,
    CountDown,
    Button,
    CellGroup,
    Cell,
    Empty,
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
    const store = useStore()

    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
        setAnswers()
      }
    )

    const activeTab = ref('score')

    const isGameOver = computed(() => store.getters['game/isGameOver'])

    const questions = computed(() => store.getters['game/questions'])

    const correctAnswers = ref([])
    const wrongAnswers = ref([])
    const passedAnswers = ref([])

    const setAnswers = () => {
      correctAnswers.value = JSON.parse(window.localStorage.getItem('correctAnswers')) || []
      wrongAnswers.value = JSON.parse(window.localStorage.getItem('wrongAnswers')) || []
      passedAnswers.value = JSON.parse(window.localStorage.getItem('passedAnswers')) || []
    }

    const shareResults = async () => {
      const shareText = `
        parolla - Günlük bilgi oyunu.

        🟩 ${correctAnswers.value.length} Doğru
        🟥 ${wrongAnswers.value.length} Yanlış
        🟨 ${passedAnswers.value.length} Pas

        https://parolla.app
      `
      try {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: 'Skorun Kopyalandı',
          position: 'bottom'
        })
        await navigator.share({
          title: 'parolla',
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

    return { state, activeTab, shareResults, correctAnswers, wrongAnswers, passedAnswers, isGameOver, questions }
  }
})
</script>

<style lang="scss" src="./StatsDialog.component.scss"></style>
