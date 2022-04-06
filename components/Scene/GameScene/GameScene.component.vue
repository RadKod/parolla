<template lang="pug">
.scene.game-scene(ref="rootRef" :class="{ 'game-scene--isMobileDevice': isMobileDevice, 'game-scene--gameOver': isGameOver }")
  // Scene Inner
  .scene__inner.game-scene__inner
    // Alphabet
    .alphabet.value.swiper.alphabet-carousel
      .alphabet__inner.swiper-wrapper
        .swiper-slide(v-for="(item, index) in alphabet.items")
          .alphabet__item(:class="[alphabetItemClasses(item, index)]") {{ item.letter }}

    // Countdown
    .countdown(:class="{ 'd-none': fetchState.pending || fetchState.error }")
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
        Button(@click="fetch()") Tekrar Dene

    template(v-else)
      // Questions
      .questions
        .question(
          v-for="(question, index) in questions"
          v-show="index === alphabet.activeIndex"
          :class="{ 'question--active': index === alphabet.activeIndex }"
        )
          strong.question__title {{ question.question }}

      // Field Section
      section.game-scene__fieldSection
        // Answer Field
        Field#answerField.answer-field(
          v-model="answer.field"
          type="text"
          placeholder="Cevabını yaz"
          spellcheck="false"
          :maxlength="ANSWER_CHAR_LENGTH"
          @keypress.enter="handleAnswer"
        )
          template(#button)
            Button.answer-field__button(
              color="var(--color-brand-02)"
              icon="guide-o"
              size="small"
              round
              :disabled="answer.field <= 0"
              @click="handleAnswer"
            )

        // Keyboard
        AppKeyboard(:input="answer.field" @onChange="handleKeyboardOnChange" @onKeyPress="handleKeyboardOnKeyPress")

  // How To Play Dialog
  HowToPlayDialog(v-if="!isGameOver" :isOpen="dialog.howToPlay.isOpen" @closed="startGame")
  // Stats Dialog
  StatsDialog(:isOpen="dialog.stats.isOpen")
</template>

<script>
import {
  defineComponent,
  useStore,
  useFetch,
  ref,
  reactive,
  computed,
  onMounted,
  nextTick,
  watch,
  onUnmounted
} from '@nuxtjs/composition-api'
import { ANSWER_CHAR_LENGTH } from '@/system/constant'
import { useUa } from '@/hooks'
import { Button, Field, Empty, CountDown, Icon, Notify, Toast } from 'vant'
import { AppKeyboard } from '@/components/Keyboard'
import { HowToPlayDialog, StatsDialog } from '@/components/Dialog'
// Swiper
import Swiper from 'swiper'
import 'swiper/swiper-bundle.min.css'
// Howler
import { Howl } from 'howler'
// Textfit
import textfit from 'textfit'

export default defineComponent({
  components: {
    Button,
    Field,
    Empty,
    CountDown,
    Icon,
    AppKeyboard,
    HowToPlayDialog,
    StatsDialog
  },
  setup() {
    const rootRef = ref(null)
    const { isMobileDevice } = useUa()

    const store = useStore()
    const persistStore = JSON.parse(window.localStorage.getItem('persistStore'))

    const day = new Date().toISOString().slice(0, 10)
    const storedDay = persistStore && persistStore.game.currentDate

    if (day !== storedDay) {
      store.commit('game/SET_IS_GAME_OVER', {
        isGameOver: false
      })
    }

    const isGameOver = computed(() => store.getters['game/isGameOver'])

    watch(isGameOver, async value => {
      if (value) {
        await nextTick()
        await endGame()
      }
    })

    const calculateStatsOfToday = async () => {
      const correctAnswers = await store.getters['game/correctAnswers']
      const wrongAnswers = await store.getters['game/wrongAnswers']
      const passedAnswers = await store.getters['game/passedAnswers']

      window.localStorage.setItem('correctAnswers', JSON.stringify(correctAnswers))
      window.localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers))
      window.localStorage.setItem('passedAnswers', JSON.stringify(passedAnswers))
    }

    const alphabet = computed(() => store.getters['game/alphabet'])

    watch(
      () => alphabet.value.activeIndex,
      async value => {
        await store.commit('game/SET_ALPHABET_ACTIVE_INDEX', value)
        await calculateStatsOfToday()

        if (value === -1) {
          endGame()

          return false
        }

        carousels.alphabet.slideTo(value)
        resetAnswer()
        questionFitText()
      }
    )

    const questions = computed(() => store.getters['game/questions'])

    watch(questions, value => {
      if (value.length > 0) {
        if (!isGameOver.value) {
          // startGame()
        }
      }
    })

    const countdown = computed(() => store.getters['game/countdown'])

    const countdownTimerRef = ref(false)

    const answer = reactive({
      field: ''
    })

    const dialog = reactive({
      howToPlay: {
        isOpen: true
      },
      stats: {
        isOpen: false
      }
    })

    const carousels = reactive({
      alphabet: {}
    })

    // Fetch Questions
    const { fetch, fetchState } = useFetch(async () => {
      if (day === storedDay) {
        await store.commit('game/SET_QUESTIONS', {
          questions: persistStore.game.questions
        })
      } else {
        await store.dispatch('game/fetchQuestions')
      }
    })

    const alphabetItemClasses = (item, index) => {
      if (index === alphabet.value.activeIndex) {
        return `alphabet__item--selected`
      }

      if (item.isPassed) {
        return `alphabet__item--passed`
      }

      if (item.isWrong) {
        return `alphabet__item--wrong`
      }

      if (item.isCorrect) {
        return `alphabet__item--correct`
      }
    }

    const nextLetter = () => {
      let index = alphabet.value.items.findIndex(item => !item.isPassed && !item.isWrong && !item.isCorrect)

      if (index !== -1) {
        return index
      }

      const passedItems = alphabet.value.items.filter(item => item.isPassed)
      const totalPassed = passedItems.length

      if (totalPassed === 1) {
        return alphabet.value.items.indexOf(passedItems[0])
      }

      for (let i = alphabet.value.activeIndex; i < alphabet.value.items.length + alphabet.value.activeIndex; i++) {
        if (i === alphabet.value.activeIndex) continue

        const element = alphabet.value.items[i % alphabet.value.items.length]

        if (element.isPassed) {
          index = i % alphabet.value.items.length
          break
        }
      }

      return index
    }

    const pass = () => {
      if (isGameOver.value) return false

      alphabet.value.items[alphabet.value.activeIndex].isPassed = true
      alphabet.value.activeIndex = nextLetter()

      soundFx.pass.play()
    }

    const handleAnswer = () => {
      if (isGameOver.value || answer.field.trim().length <= 0) return false

      const item = alphabet.value.items[alphabet.value.activeIndex]

      item.isPassed = false

      const answerField = answer.field.toLocaleLowerCase('tr').trim().replace(/\s+/g, '')
      const correctAnswer = questions.value[alphabet.value.activeIndex].answer.toLocaleLowerCase('tr').trim().replace(/\s+/g, '')

      if (answerField === correctAnswer) {
        item.isCorrect = true
        soundFx.correct.play()
      } else {
        item.isWrong = true
        soundFx.wrong.play()
      }

      alphabet.value.activeIndex = nextLetter()
    }

    const resetAnswer = () => {
      answer.field = ''
    }

    const initCarousels = async () => {
      await nextTick()

      const alphabetCarousel = new Swiper('.alphabet-carousel', {
        speed: 800,
        spaceBetween: 24,
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: false,
        clickable: false,
        allowTouchMove: false,
        slideToClickedSlide: false
      })

      carousels.alphabet = alphabetCarousel
    }
    const soundFx = reactive({
      start: null,
      correct: null,
      wrong: null,
      pass: null,
      halfTime: null
    })

    const startSoundFx = new Howl({
      src: ['/sound/fx/start.wav']
    })

    const correctSoundFx = new Howl({
      src: ['/sound/fx/correct.wav']
    })

    const wrongSoundFx = new Howl({
      src: ['/sound/fx/wrong.wav']
    })

    const passSoundFx = new Howl({
      src: ['/sound/fx/pass.ogg']
    })

    const halfTimeSoundFx = new Howl({
      src: ['/sound/fx/half-time.wav']
    })

    soundFx.start = startSoundFx
    soundFx.correct = correctSoundFx
    soundFx.wrong = wrongSoundFx
    soundFx.pass = passSoundFx
    soundFx.halfTime = halfTimeSoundFx

    const handleKeyboardOnChange = input => {
      answer.field = input
    }

    const handleKeyboardOnKeyPress = button => {
      if (button === '{enter}') {
        handleAnswer()
      }

      if (button === '{pass}') {
        pass()
      }
    }

    const startGame = async () => {
      await nextTick()

      if (isGameOver.value) return false

      setTimeout(() => {
        questionFitText()
      }, 0)

      startSoundFx.play()
      setTimeout(() => {
        countdownTimerRef.value.start()

        window.localStorage.setItem('correctAnswers', JSON.stringify([]))
        window.localStorage.setItem('wrongAnswers', JSON.stringify([]))
        window.localStorage.setItem('passedAnswers', JSON.stringify([]))
      }, 1000) // 1 second sleep
    }

    const endGame = async () => {
      await nextTick()

      store.commit('game/SET_IS_GAME_OVER', {
        isGameOver: true
      })
      countdownTimerRef.value.pause()
      dialog.stats.isOpen = true
    }

    const listenCountdown = async timeData => {
      let days = timeData.days * 24 * 60 * 60 * 1000
      let hours = timeData.hours * 60 * 60 * 1000
      let minutes = timeData.minutes * 60 * 1000
      let seconds = timeData.seconds * 1000
      let milliseconds = timeData.milliseconds

      let remainTime = days + hours + minutes + seconds + milliseconds

      await store.commit('game/UPDATE_COUNTDOWN_TIMER', remainTime)
      await countdownTimerRef.value.start()

      if (timeData.minutes === 2 && timeData.seconds === 0) {
        halfTimeSoundFx.play()
        Notify({
          message: 'Sürenin yarısı doldu',
          color: 'var(--color-text-04)',
          background: 'var(--color-warning-01)'
        })
      }
    }

    const handleCountdownFinish = async () => {
      await Toast({
        message: 'Süre Doldu',
        position: 'bottom'
      })
      await endGame()
    }

    const questionFitText = async () => {
      await nextTick()

      textfit(rootRef.value.querySelectorAll('.question--active')[0], {
        minFontSize: 14,
        maxFontSize: 30
      })
    }

    onMounted(() => {
      initCarousels()

      // Check game over
      if (isGameOver.value) {
        endGame()
      }

      window.addEventListener('resize', questionFitText)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', questionFitText)
    })

    return {
      rootRef,
      isMobileDevice,
      ANSWER_CHAR_LENGTH,
      fetch,
      fetchState,
      isGameOver,
      alphabet,
      questions,
      answer,
      dialog,
      countdown,
      countdownTimerRef,
      alphabetItemClasses,
      pass,
      handleAnswer,
      resetAnswer,
      handleKeyboardOnChange,
      handleKeyboardOnKeyPress,
      startGame,
      listenCountdown,
      handleCountdownFinish
    }
  }
})
</script>

<style lang="scss" src="./GameScene.component.scss"></style>
