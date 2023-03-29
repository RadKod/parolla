<template lang="pug">
Dialog.dialog.stats-dialog.unlimited-mode-stats-dialog(
  v-model="state.isOpen"
  title="İstatistik"
  :cancel-button-text="cancelButtonText"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
)
  template(v-if="isGameOver")
    // Tabs
    Tabs.stats-dialog__tabs(v-model="activeTab")
      // Score Tab
      Tab(name="score" title="Skor Dağılımı")
        br
        // Scoreboard
        .scoreboard
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

          p Kalan Süre: <strong>{{ remainTime }}</strong>

        // Actions
        .stats-dialog__actions
          // Result Sharer
          .result-sharer
            Button.result-sharer__button(color="var(--color-success-01)" icon="share-o" icon-position="right" round @click="shareResults") PAYLAŞ
      Tab(name="answers" title="Cevap Anahtarı")
        // Answers
        .answers
          Collapse.answers__inner(v-model="toggledAnswer" accordion)
            // Answer
            CollapseItem.answer(
              v-for="question in questions"
              :key="question.letter"
              :value="question.letter"
              :class="[answerClasses(question)]"
              :name="question.letter"
              :title="question.answer"
            )
              p.answer__question
                strong Soru:
                span &nbsp;{{ question.question }}
              p.answer__correctAnswer
                strong Doğru cevap:
                span &nbsp;{{ question.answer.toLocaleUpperCase('tr') }}
              p.answer__myAnswer
                strong Senin cevabın:
                span(v-if="myAnswer(question) && myAnswer(question).field.length > 0") &nbsp;{{ myAnswer(question).field.toLocaleUpperCase('tr') }}
                span(v-else) &nbsp;-

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
import { defineComponent, useStore, ref, reactive, watch, computed } from '@nuxtjs/composition-api'
import { useTime } from '@/hooks'
import { Dialog, Tabs, Tab, Icon, CountDown, Button, Toast, Collapse, CollapseItem, Empty } from 'vant'
import { RadKodLogo } from '@/components/Logo'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    Tabs,
    Tab,
    Icon,
    CountDown,
    Button,
    Collapse,
    CollapseItem,
    Empty,
    RadKodLogo
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
    const store = useStore()
    const { convertMsToTime } = useTime()

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
    const toggledAnswer = ref(['A'])

    const isGameOver = computed(() => store.getters['unlimited/isGameOver'])

    const questions = computed(() => store.getters['unlimited/questions'])

    const correctAnswers = ref([])
    const wrongAnswers = ref([])
    const passedAnswers = ref([])

    const setAnswers = () => {
      correctAnswers.value = JSON.parse(window.localStorage.getItem('unlimitedCorrectAnswers')) || []
      wrongAnswers.value = JSON.parse(window.localStorage.getItem('unlimitedWrongAnswers')) || []
      passedAnswers.value = JSON.parse(window.localStorage.getItem('unlimitedPassedAnswers')) || []
    }

    const remainTime = computed(() => {
      if (isGameOver.value) {
        const { minutes, seconds } = convertMsToTime(store.getters['unlimited/countdown'].time)

        return `${minutes}:${seconds}`
      }
    })

    const shareResults = async () => {
      const shareText = `parolla - Günlük bilgi oyunu. \n\n(Limitsiz Oyun Modu) \n\n🟩 ${correctAnswers.value.length} Doğru \n🟥 ${wrongAnswers.value.length} Yanlış \n🟨 ${passedAnswers.value.length} Pas \n \nKalan Süre: ${remainTime.value} \n \nhttps://parolla.app`
      try {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: 'Skorun Kopyalandı',
          position: 'bottom'
        })
        await navigator.share({
          title: 'parolla',
          text: shareText
        })
      } catch {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: 'Skorun Kopyalandı',
          position: 'bottom'
        })
      }
    }

    const answerClasses = question => {
      const correct = correctAnswers.value.some(item => question.letter === item.letter)
      const wrong = wrongAnswers.value.some(item => question.letter === item.letter)
      const passed = passedAnswers.value.some(item => question.letter === item.letter)

      if (correct) {
        return 'answer--correct'
      }

      if (wrong) {
        return 'answer--wrong'
      }

      if (passed) {
        return 'answer--passed'
      }
    }

    const myAnswer = question => {
      const storedAnswers = JSON.parse(window.localStorage.getItem('unlimitedMyAnswers'))

      if (storedAnswers && storedAnswers.length > 0) {
        return storedAnswers.filter(item => question.letter === item.letter).reverse()[0]
      } else {
        return {
          field: '-'
        }
      }
    }

    return {
      state,
      activeTab,
      toggledAnswer,
      remainTime,
      shareResults,
      correctAnswers,
      wrongAnswers,
      passedAnswers,
      isGameOver,
      questions,
      answerClasses,
      myAnswer
    }
  }
})
</script>

<style lang="scss" src="./UnlimitedModeStatsDialog.component.scss"></style>