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
      .tour-mode-game-scene-countdown__bar
      .tour-mode-game-scene-countdown__timer 15

    // Fetch State
    template(v-if="fetchState.pending")
      Empty(:description="$t('gameScene.pendingQuestions')")

    template(v-else-if="fetchState.error")
      Empty(image="error" :description="$t('gameScene.error.fetchQuestions.description')")
        Button(@click="reFetch") {{ $t('gameScene.error.fetchQuestions.action') }}

    template(v-else)
      // Questions
      .questions
        .question(:class="{ 'question--osk': answer.isFocused }")
          strong.question__title Bir şehir veya bir bölge avukatlarının bağlı oldukları meslek kuruluşu

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

  // How To Play Dialog
  //HowToPlayDialog(v-if="!isGameOver" :isOpen="dialog.howToPlay.isOpen" @closed="startGame")

  // Interstital Ad Dialog
  InterstitialAdDialog(:cancelButtonText="$t('gameScene.skipAdShowScore')" :isOpen="dialog.interstitialAd.isOpen")
</template>

<script>
import { defineComponent, useStore, useFetch, ref, onMounted, onUnmounted, computed } from '@nuxtjs/composition-api'
import { ANSWER_CHAR_LENGTH } from '@/system/constant'
import { Button, Field, Empty, CountDown } from 'vant'

export default defineComponent({
  components: {
    Button,
    Field,
    Empty,
    CountDown
  },
  setup() {
    const rootRef = ref(null)
    const store = useStore()

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
      isTouchEnabled
    }
  }
})
</script>

<style lang="scss" src="./TourModeGameScene.component.scss"></style>
