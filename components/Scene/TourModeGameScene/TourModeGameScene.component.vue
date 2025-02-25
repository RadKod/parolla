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
          Popover.answer-field-max-lives(
            v-model="tour.popover.maxLives.isOpen"
            placement="top-start"
            trigger="click"
            close-on-click-outside
          )
            template(#reference)
              .answer-field-max-lives__button(role="button")
                AppIcon(name="fluent-emoji:heart-suit" :label="String(tour.maxLives)" :width="32" :height="32")

            .answer-field-max-lives__content
              p Tahmin hakkın
          input.answer-field__input(
            type="text"
            :value="answer.field"
            :placeholder="$t('gameScene.answerField.placeholder')"
            tabindex="-1"
            spellcheck="false"
            autocomplete="off"
            :maxlength="ANSWER_CHAR_LENGTH"
            :disabled="tour.maxLives <= 0"
            @input="handleAnswerField"
            @focus="answer.isFocused = true"
            @blur="answer.isFocused = false"
            @keypress.enter="handleAnswer"
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
import { Button, Field, Empty, CountDown, Progress, Popover, Notify } from 'vant'
import useWs from '@/composables/useWs'

export default defineComponent({
  components: {
    Button,
    Field,
    Empty,
    CountDown,
    Progress,
    Popover,
    Notify
  },
  setup() {
    const rootRef = ref(null)
    const store = useStore()
    const ws = useWs()

    const {
      setRootRef,
      answer,
      dialog,
      questionFitText,
      handleBeforeUnload,
      scrollTop,
      isTouchEnabled,
      handleDontHideKeyboard,
      handleTabKey,
      checkUnsupportedHeight,
      formatAnswerField,
      wrongAnimateAnswerField,
      resetAnswerField,
      soundFx
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
      maxLives: 3,
      waitingNextSeconds: 10,
      isEnded: false,
      popover: {
        maxLives: {
          isOpen: false
        }
      }
    })

    onMounted(() => {
      setRootRef(rootRef.value)

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
      tour.question = question
    }

    const onTimeUpdate = ({ time }) => {
      tour.countdown.seconds = Math.floor(time.remaining / 1000)
      tour.countdown.percentage = time.percentage
    }

    const onTimeUp = ({ correctAnswer }) => {
      tour.isEnded = true
      tour.correctAnswer = correctAnswer
      tour.countdown.seconds = 30
      tour.countdown.percentage = 0
      tour.maxLives = 3

      resetAnswerField()
    }

    const onWaitingNext = ({ time }) => {
      tour.waitingNextSeconds = Math.floor(time.remaining / 1000)

      if (time.remaining <= 1000) {
        if (tour.isEnded) {
          setTimeout(() => {
            tour.isEnded = false
          }, 1000)
        }
      }
    }

    const onAnswerResult = params => {
      const { correct, lives, score } = params

      if (correct) {
        Notify({
          message: 'Doğru cevap, lütfen tur bitene kadar bekle',
          color: 'var(--color-text-04)',
          background: 'var(--color-success-01)',
          duration: 30000
        })

        soundFx.correct.play()
      } else {
        wrongAnimateAnswerField()

        Notify({
          message: 'Yanlış cevap',
          color: 'var(--color-text-04)',
          background: 'var(--color-danger-01)',
          duration: 1500
        })

        soundFx.wrong.play()
      }

      tour.maxLives = lives

      if (lives <= 0) {
        Notify({
          message: 'Tahmin hakkın bitti, lütfen tur bitene kadar bekle',
          color: 'var(--color-text-04)',
          background: 'var(--color-danger-01)',
          duration: 30000
        })
      }

      resetAnswerField()
    }

    const handleAnswer = () => {
      const answerField = formatAnswerField()

      ws.send(JSON.stringify({ type: wsTypeEnum.TOUR_ANSWER, answer: answerField }))
    }

    const handleAnswerField = $event => {
      answer.field = $event.target.value
    }

    ws.onmessage = data => {
      const { type, question, correctAnswer, time, correct, lives, score } = JSON.parse(data.data)

      if (type === wsTypeEnum.TOUR_QUESTION) {
        onQuestionGot({ question })
      }

      if (type === wsTypeEnum.TOUR_TIME_UPDATE) {
        onTimeUpdate({ time })
      }

      if (type === wsTypeEnum.TOUR_TIME_UP) {
        onTimeUp({ correctAnswer })
      }

      if (type === wsTypeEnum.TOUR_WAITING_NEXT) {
        onWaitingNext({ time })
      }

      if (type === wsTypeEnum.TOUR_ANSWER_RESULT) {
        onAnswerResult({ correct, lives, score })
      }
    }

    return {
      rootRef,
      ANSWER_CHAR_LENGTH,
      fetch,
      fetchState,
      answer,
      dialog,
      handleAnswerField,
      handleAnswer,
      handleTabKey,
      isTouchEnabled,
      isTourModeOnlineDialogOpen,
      closeTourModeOnlineDialog,
      tour
    }
  }
})
</script>

<style lang="scss" src="./TourModeGameScene.component.scss"></style>
