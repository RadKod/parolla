<template lang="pug">
.scene.game-scene.unlimited-mode-game-scene(
  ref="rootRef"
  tabindex="1"
  :class="{ 'game-scene--isMobileDevice': $ua.isFromMobilephone(), 'game-scene--gameOver': isGameOver, 'game-scene--osk': answer.isFocused }"
)
  // Scene Inner
  .scene__inner.game-scene__inner
    // Alphabet
    .alphabet.value.swiper.alphabet-carousel
      .alphabet__inner.swiper-wrapper
        .swiper-slide(v-for="(item, index) in alphabet.items")
          .alphabet__item(:class="[alphabetItemClasses(item, index)]") {{ item.letter }}

    // Countdown
    .countdown.game-scene__countdown(:class="{ 'd-none': fetchState.pending || fetchState.error }")
      Icon.countdown__icon(name="clock-o")
      CountDown.countdown__timer(
        ref="countdownTimerRef"
        format="mm:ss"
        :auto-start="false"
        :time="countdown.time"
        @change="listenCountdown"
        @finish="handleCountdownFinish"
      )

    // Fetch State
    template(v-if="fetchState.pending")
      Empty(description="Sorular getiriliyor...")

    template(v-else-if="fetchState.error")
      Empty(image="error" description="Veriler alınırken hata oluştu.")
        Button(@click="reFetch") Tekrar Dene

    template(v-else)
      // Questions
      .questions
        .question(
          v-for="(question, index) in questions"
          v-show="index === alphabet.activeIndex"
          :class="{ 'question--active': index === alphabet.activeIndex, 'question--osk': answer.isFocused }"
        )
          strong.question__title {{ question.question }}

      // Field Section
      section.game-scene__fieldSection(:class="{ 'game-scene__fieldSection--disabled': !isGameStarted }")
        // Answer Field
        .answer-field
          input.answer-field__input(
            type="text"
            :value="answer.field"
            placeholder="Cevabını yaz"
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
          // Optional action buttons
          template(v-if="answer.field.length > 0")
            Button.answer-field__button.answer-field__button--send.do-not-hide-keyboard.do-not-hide-keyboard--send(
              color="var(--color-brand-02)"
              icon="guide-o"
              @click="handleAnswer"
            ) GÖNDER

          template(v-else)
            Button.answer-field__button.answer-field__button--pass.do-not-hide-keyboard.do-not-hide-keyboard--pass(
              color="var(--color-warning-01)"
              icon="arrow"
              @click="pass"
            ) PAS

  // How To Play Dialog
  HowToPlayDialog(v-if="!isGameOver" :isOpen="dialog.howToPlay.isOpen" @closed="startGame")
  // Stats Dialog
  UnlimitedModeStatsDialog(
    cancelButtonText="Kapat"
    confirmButtonText="Baştan oyna"
    :isOpen="unlimitedDialog.stats.isOpen"
    @onCancel="$store.commit('unlimited/SET_IS_OPEN_STATS_DIALOG', false)"
    @onConfirm="resetGame"
  )
  // Interstital Ad Dialog
  InterstitialAdDialog(cancelButtonText="Reklamı geç ve skorunu gör ⇥" :isOpen="dialog.interstitialAd.isOpen")
</template>

<script>
import { defineComponent, useStore, useFetch, ref, onMounted, onUnmounted, computed } from '@nuxtjs/composition-api'
import { ANSWER_CHAR_LENGTH } from '@/system/constant'
import { useGameScene } from '@/hooks'
import { Button, Field, Empty, CountDown, Icon } from 'vant'
import { HowToPlayDialog, UnlimitedModeStatsDialog, InterstitialAdDialog } from '@/components/Dialog'

export default defineComponent({
  components: {
    Button,
    Field,
    Empty,
    CountDown,
    Icon,
    HowToPlayDialog,
    UnlimitedModeStatsDialog,
    InterstitialAdDialog
  },
  setup() {
    const rootRef = ref(null)
    const store = useStore()

    const {
      setRootRef,
      isGameStarted,
      isGameOver,
      alphabet,
      alphabetItemClasses,
      questions,
      answer,
      countdown,
      countdownTimerRef,
      handleAnswer,
      handleAnswerField,
      handleTabKey,
      pass,
      initCarousels,
      dialog,
      startGame,
      listenCountdown,
      handleCountdownFinish,
      questionFitText,
      handleBeforeUnload,
      scrollTop,
      isTouchEnabled,
      handleDontHideKeyboard,
      handlePopState,
      checkUnsupportedHeight
    } = useGameScene()

    const unlimitedDialog = computed(() => store.getters['unlimited/dialog'])

    // Fetch Questions
    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('unlimited/fetchQuestions')
    })

    const reFetch = async () => {
      await resetGame()

      if (questions.value.length > 0) {
        startGame()
      }
    }

    const resetGame = async () => {
      await fetch()
      await store.commit('unlimited/SET_IS_GAME_OVER', {
        isGameOver: false
      })
      await store.commit('unlimited/RESET_COUNTDOWN_TIMER')
      await store.commit('unlimited/RESET_ALPHABET')
      await store.commit('unlimited/SET_IS_OPEN_STATS_DIALOG', false)

      dialog.howToPlay.isOpen = true
    }

    onMounted(() => {
      setRootRef(rootRef.value)
      resetGame()

      initCarousels()

      window.addEventListener('keyup', event => handleTabKey(event))

      window.addEventListener('resize', questionFitText)
      window.addEventListener('beforeunload', event => handleBeforeUnload(event))

      window.addEventListener('scroll', scrollTop)

      if (isTouchEnabled) {
        rootRef.value.addEventListener('touchend', event => handleDontHideKeyboard(event))
      }

      handlePopState()

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

    return {
      rootRef,
      ANSWER_CHAR_LENGTH,
      fetch,
      fetchState,
      reFetch,
      isGameStarted,
      isGameOver,
      alphabet,
      questions,
      answer,
      dialog,
      unlimitedDialog,
      countdown,
      countdownTimerRef,
      alphabetItemClasses,
      pass,
      handleAnswerField,
      handleAnswer,
      startGame,
      listenCountdown,
      handleCountdownFinish,
      isTouchEnabled,
      resetGame
    }
  }
})
</script>

<style lang="scss" src="./UnlimitedModeGameScene.component.scss"></style>
