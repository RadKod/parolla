<template lang="pug">
.scene.game-scene(
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
          )
          // Optional action buttons
            Button.answer-field__button.answer-field__button--pass(
              color="var(--color-warning-01)"
              icon="arrow"
              size="small"
              round
              @click="pass"
            )
            Button.answer-field__button(
              color="var(--color-brand-02)"
              icon="guide-o"
              size="small"
              round
              :disabled="answer.field <= 0"
              @click="handleAnswer"
            )

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
  onUnmounted,
  useContext
} from '@nuxtjs/composition-api'
import { ANSWER_CHAR_LENGTH } from '@/system/constant'
import { Button, Field, Empty, CountDown, Icon, Notify, Toast } from 'vant'
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
    HowToPlayDialog,
    StatsDialog
  },
  setup() {
    const rootRef = ref(null)
    const context = useContext()

    const store = useStore()
    const persistStore = JSON.parse(window.localStorage.getItem('persistStore'))

    const day = new Date().toLocaleDateString('tr').slice(0, 10)
    const storedDay = persistStore && persistStore.game.currentDate

    if (day !== storedDay) {
      store.commit('game/SET_IS_GAME_OVER', {
        isGameOver: false
      })
      store.commit('game/SET_CURRENT_DATE', day)
    }

    const isGameStarted = ref(false)

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

    const myAnswers = ref([])
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

    const countdown = computed(() => store.getters['game/countdown'])

    const countdownTimerRef = ref(false)

    const answer = reactive({
      field: '',
      isFocused: false
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
      await store.dispatch('game/fetchQuestions')
    })

    const reFetch = async () => {
      await fetch()

      if (questions.value.length > 0) {
        startGame()
      }
    }

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

      myAnswers.value.push({ ...alphabet.value.items[alphabet.value.activeIndex], field: answer.field })
      window.localStorage.setItem('myAnswers', JSON.stringify(myAnswers.value))

      alphabet.value.activeIndex = nextLetter()

      soundFx.pass.play()
    }

    const handleAnswerField = $event => {
      answer.field = $event.target.value
    }

    watch(
      () => answer.isFocused,
      currentValue => {
        if (currentValue) {
          questionFitText()
        }
      }
    )

    const handleAnswer = () => {
      if (isGameOver.value || answer.field.trim().length <= 0) return false

      const item = alphabet.value.items[alphabet.value.activeIndex]

      item.isPassed = false

      const answerField = answer.field.toLocaleLowerCase('tr').trim().replace(/\s+/g, '')
      const correctAnswers = questions.value[alphabet.value.activeIndex].answer.split(',')

      const passKeyword = 'pas'

      if (answerField === passKeyword.toLocaleLowerCase('tr').trim().replace(/\s+/g, '')) {
        pass()

        return false
      }

      const isCorrect = correctAnswers.some(answer => {
        if (answerField === answer.toLocaleLowerCase('tr').trim().replace(/\s+/g, '')) {
          item.isCorrect = true
          soundFx.correct.play()

          return true
        }
      })

      if (!isCorrect) {
        item.isWrong = true
        soundFx.wrong.play()
      }

      myAnswers.value.push({ ...alphabet.value.items[alphabet.value.activeIndex], field: answer.field })
      window.localStorage.setItem('myAnswers', JSON.stringify(myAnswers.value))

      alphabet.value.activeIndex = nextLetter()
    }

    const focusToAnswerFieldInput = () => {
      rootRef.value.querySelector('.answer-field__input').focus()
      answer.isFocused = true
    }

    const resetAnswer = () => {
      answer.field = ''
    }

    const handleTabKey = event => {
      if (!isGameStarted.value) return false

      if (event.key === 'Tab' || event.keyCode === 9) {
        pass()
        focusToAnswerFieldInput()
      }
    }

    const initCarousels = async () => {
      await nextTick()

      const alphabetCarousel = new Swiper('.alphabet-carousel', {
        direction: 'horizontal',
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

    const startGame = async () => {
      await nextTick()

      if (questions.value.length <= 0) return false

      if (isGameOver.value) return false

      setTimeout(() => {
        questionFitText()
      }, 0) // DOM Bypass

      const toast = Toast.loading({
        className: 'start-game-toast',
        overlay: true,
        duration: 0, // continuous display toast
        forbidClick: true,
        loadingType: 'spinner',
        message: `5 \n Yenilikler: \n Artık paslamak için pas yazmalısın. \n Nihayet kendi klavyeni kullanabilirsin.`
      })
      let second = 5
      const timer = setInterval(() => {
        second--

        if (second) {
          toast.message = `${second} \n Yenilikler: \n Artık paslamak için pas yazmalısın. \n Nihayet kendi klavyeni kullanabilirsin.`
        } else {
          clearInterval(timer)
          Toast.clear()
        }
      }, 1000)

      setTimeout(() => {
        countdownTimerRef.value.start()
        isGameStarted.value = true
        startSoundFx.play()

        if (context.$ua.isFromAndroidOs()) {
          focusToAnswerFieldInput()
        }

        window.localStorage.setItem('correctAnswers', JSON.stringify([]))
        window.localStorage.setItem('wrongAnswers', JSON.stringify([]))
        window.localStorage.setItem('passedAnswers', JSON.stringify([]))
        window.localStorage.setItem('myAnswers', JSON.stringify([]))
      }, 6000) // 5+1 second sleep
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
      await window.localStorage.setItem('remainTime', `${timeData.minutes}:${timeData.seconds}`)
      await countdownTimerRef.value.start()

      if (timeData.minutes === 2 && timeData.seconds === 30) {
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

    const handleBeforeUnload = event => {
      if (isGameStarted.value && !isGameOver.value) {
        event.preventDefault()
        event.returnValue = ''
      }
    }

    const scrollTop = () => {
      window.scrollTo(0, 0)
    }

    onMounted(() => {
      initCarousels()

      // Check game over
      if (isGameOver.value) {
        endGame()
      }

      window.addEventListener('keyup', event => handleTabKey(event))

      window.addEventListener('resize', questionFitText)
      window.addEventListener('beforeunload', event => handleBeforeUnload(event))

      window.addEventListener('scroll', scrollTop)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', questionFitText)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      window.removeEventListener('scroll', scrollTop)
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
      countdown,
      countdownTimerRef,
      alphabetItemClasses,
      pass,
      handleAnswerField,
      handleAnswer,
      resetAnswer,
      startGame,
      listenCountdown,
      handleCountdownFinish
    }
  }
})
</script>

<style lang="scss" src="./GameScene.component.scss"></style>
