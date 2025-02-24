<template lang="pug">
.scene.game-scene.tour-mode-game-scene(
  ref="rootRef"
  tabindex="1"
  :class="{ 'game-scene--isMobileDevice': $ua.isFromMobilephone(), 'game-scene--osk': $ua.isFromIos() }"
)
  // Scene Inner
  .scene__inner.game-scene__inner
    // Countdown
    .tour-mode-game-scene-countdown
      Progress(color="var(--color-brand-02)" :pivot-text="String(tour.countdown.seconds)" :percentage="tour.countdown.percentage")

    // Fetch State
    template(v-if="fetchState.pending")
      Empty(:description="$t('gameScene.pendingQuestions')")

    template(v-else-if="fetchState.error")
      Empty(image="error" :description="$t('gameScene.error.fetchQuestions.description')")
        Button(@click="reFetch") {{ $t('gameScene.error.fetchQuestions.action') }}

    template(v-if="tour.question")
      // Questions
      .questions
        .question(:class="{ 'question--osk': answer.isFocused }")
          strong.question__title {{ tour.question.question }}

      // Field Section
      section.game-scene__fieldSection
        // Answer Field
        .answer-field
          input.answer-field__input(
            type="text"
            :value="answer.field"
            :placeholder="$t('gameScene.answerField.placeholder')"
            tabindex="-1"
            spellcheck="false"
            autocomplete="off"
            :maxlength="ANSWER_CHAR_LENGTH"
            @input="handleAnswerField"
            @focus="answer.isFocused = true"
            @blur="answer.isFocused = false"
            @keypress.enter="handleAnswer"
            @keydown.tab.prevent="pass"
          )
          Button.answer-field__button.answer-field__button--send.do-not-hide-keyboard.do-not-hide-keyboard--send(
            color="var(--color-brand-02)"
            icon="guide-o"
            :inert="answer.field.length <= 0"
            :disabled="answer.field.length <= 0"
            @click="handleAnswer"
          ) {{ $t('gameScene.answerField.submit') }}

  // Tour Results View
  transition(name="slide-fade")
    TourModeResultsView(v-if="tour.isEnded" :tour="tour")

  // How To Play Dialog
  //HowToPlayDialog(v-if="!isGameOver" :isOpen="dialog.howToPlay.isOpen" @closed="startGame")

  // Interstital Ad Dialog
  InterstitialAdDialog(:cancelButtonText="$t('gameScene.skipAdShowScore')" :isOpen="dialog.interstitialAd.isOpen")

  // Tour Mode Online Dialog
  LazyTourModeOnlineDialog(:isOpen="isTourModeOnlineDialogOpen" @closed="closeTourModeOnlineDialog")

  // Chat Panel
  ChatPanel
    template(#content-prepend)
      .section-title Son cevaplar
      .last-answers
        TourModeUserList
      .section-title Sohbet
</template>

<script>
import { defineComponent, useStore, useFetch, ref, reactive, onMounted, onUnmounted, computed } from '@nuxtjs/composition-api'
import { ANSWER_CHAR_LENGTH } from '@/system/constant'
import { wsTypeEnum } from '@/enums'
import { Button, Field, Empty, CountDown, Progress } from 'vant'
import useWs from '@/composables/useWs'

export default defineComponent({
  components: {
    Button,
    Field,
    Empty,
    CountDown,
    Progress
  },
  setup() {
    const rootRef = ref(null)
    const store = useStore()
    const ws = useWs()

    const {
      setRootRef,
      questions,
      answer,
      handleAnswer,
      handleAnswerField,
      initCarousels,
      dialog,
      questionFitText,
      handleBeforeUnload,
      scrollTop,
      isTouchEnabled,
      handleDontHideKeyboard,
      checkUnsupportedHeight
    } = useGameScene()

    // Fetch Questions
    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('unlimited/fetchQuestions')
    })

    const tour = reactive({
      question: null,
      countdown: {
        percentage: 0,
        seconds: 30
      },
      waitingNextSeconds: 10,
      isEnded: false
    })

    onMounted(() => {
      setRootRef(rootRef.value)

      initCarousels()

      window.addEventListener('keyup', event => handleTabKey(event))

      window.addEventListener('resize', questionFitText)
      window.addEventListener('beforeunload', event => handleBeforeUnload(event))

      window.addEventListener('scroll', scrollTop)

      if (isTouchEnabled) {
        rootRef.value?.addEventListener('touchend', event => handleDontHideKeyboard(event))
      }

      // Unsupported screen height
      checkUnsupportedHeight()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', questionFitText)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      window.removeEventListener('scroll', scrollTop)

      if (isTouchEnabled) {
        rootRef.value?.removeEventListener('touchend', handleDontHideKeyboard)
      }
    })

    const isTourModeOnlineDialogOpen = computed(() => store.getters['tour/dialog'].tourModeOnline.isOpen)

    const closeTourModeOnlineDialog = () => {
      store.commit('tour/SET_IS_OPEN_TOUR_MODE_ONLINE_DIALOG', false)
    }

    const onQuestionGot = ({ question }) => {
      console.log('Question got:', question)
      tour.question = question
    }

    const onTimeUpdate = ({ time }) => {
      tour.countdown.seconds = Math.floor(time.remaining / 1000)
      tour.countdown.percentage = time.percentage
    }

    const onTimeUp = ({ correctAnswer }) => {
      tour.isEnded = true
      tour.countdown.seconds = 30
      tour.countdown.percentage = 0
      tour.correctAnswer = correctAnswer
    }

    const onWaitingNext = ({ time }) => {
      tour.waitingNextSeconds = Math.floor(time.remaining / 1000)

      if (time.remaining <= 1000) {
        tour.isEnded = false
      }
    }

    ws.onmessage = data => {
      const { type, question, correctAnswer, time } = JSON.parse(data.data)

      if (type === wsTypeEnum.QUESTION) {
        onQuestionGot({ question })
      }

      if (type === wsTypeEnum.TIME_UPDATE) {
        onTimeUpdate({ time })
      }

      if (type === wsTypeEnum.TIME_UP) {
        onTimeUp({ correctAnswer })
      }

      if (type === wsTypeEnum.WAITING_NEXT) {
        onWaitingNext({ time })
      }
    }

    return {
      rootRef,
      ANSWER_CHAR_LENGTH,
      fetch,
      fetchState,
      questions,
      answer,
      dialog,
      handleAnswerField,
      handleAnswer,
      isTouchEnabled,
      isTourModeOnlineDialogOpen,
      closeTourModeOnlineDialog,
      tour
    }
  }
})
</script>

<style lang="scss" src="./TourModeGameScene.component.scss"></style>
