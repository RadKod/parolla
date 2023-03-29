<template lang="pug">
.scene.game-scene.daily-mode-game-scene(
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
  DailyModeStatsDialog(:isOpen="dialog.stats.isOpen")
  // Interstital Ad Dialog
  InterstitialAdDialog(cancelButtonText="Reklamı geç ve skorunu gör ⇥" :isOpen="dialog.interstitialAd.isOpen")
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
import { ALPHABET_LENGTH, ANSWER_CHAR_LENGTH, UNSUPPORTED_HEIGHT } from '@/system/constant'
import { Button, Field, Empty, CountDown, Icon, Notify, Toast } from 'vant'
import { HowToPlayDialog, DailyModeStatsDialog, InterstitialAdDialog } from '@/components/Dialog'
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
    DailyModeStatsDialog,
    InterstitialAdDialog
  },
  setup() {
    const rootRef = ref(null)
    const context = useContext()

    const store = useStore()
    const persistStore = JSON.parse(window.localStorage.getItem('persistStore'))

    const day = new Date().toLocaleDateString('tr').slice(0, 10)
    const storedDay = persistStore && persistStore.daily.currentDate

    if (day !== storedDay) {
      store.commit('daily/SET_IS_GAME_OVER', {
        isGameOver: false
      })
      store.commit('daily/SET_CURRENT_DATE', day)
      store.dispatch('daily/fetchQuestions')
    }

    const isGameStarted = ref(false)

    const isGameOver = computed(() => store.getters['daily/isGameOver'])

    watch(isGameOver, async value => {
      if (value) {
        await nextTick()
        await endGame()
      }
    })

    const calculateStats = async () => {
      const correctAnswers = await store.getters['daily/correctAnswers']
      const wrongAnswers = await store.getters['daily/wrongAnswers']
      const passedAnswers = await store.getters['daily/passedAnswers']

      window.localStorage.setItem('dailyCorrectAnswers', JSON.stringify(correctAnswers))
      window.localStorage.setItem('dailyWrongAnswers', JSON.stringify(wrongAnswers))
      window.localStorage.setItem('dailyPassedAnswers', JSON.stringify(passedAnswers))
    }

    const myAnswers = ref([])
    watch(
      () => myAnswers.value,
      currentValue => {
        const passedAnswers = store.getters['daily/passedAnswers']

        if (currentValue.length === ALPHABET_LENGTH && passedAnswers.length > 0) {
          Notify({
            message: 'Aklına bir cevap gelmezse süreyi beklemene gerek yok, bitir yazıp bitirebilirsin de.',
            color: 'var(--color-text-04)',
            background: 'var(--color-info-01)',
            duration: 4000
          })
        }
      }
    )
    const alphabet = computed(() => store.getters['daily/alphabet'])

    watch(
      () => alphabet.value.activeIndex,
      async value => {
        await store.commit('daily/SET_ALPHABET_ACTIVE_INDEX', value)
        await calculateStats()

        if (value === -1) {
          endGame()

          return false
        }

        carousels.alphabet.slideTo(value)
        resetAnswer()
        questionFitText()
      }
    )

    const questions = computed(() => store.getters['daily/questions'])

    const countdown = computed(() => store.getters['daily/countdown'])

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
      },
      interstitialAd: {
        isOpen: false
      }
    })

    const carousels = reactive({
      alphabet: {}
    })

    // Fetch Questions
    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('daily/fetchQuestions')
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
      window.localStorage.setItem('dailyMyAnswers', JSON.stringify(myAnswers.value))

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
      const endGameKeyword = 'bitir'
      const radkodKeyword = 'radkod'

      if (
        answerField === passKeyword.toLocaleLowerCase('tr').trim().replace(/\s+/g, '') &&
        !correctAnswers.includes(passKeyword.toLocaleLowerCase('tr').trim().replace(/\s+/g, ''))
      ) {
        pass()

        return false
      }

      if (answerField === endGameKeyword.toLocaleLowerCase('tr').trim().replace(/\s+/g, '')) {
        endGame()

        return false
      }

      if (answerField === radkodKeyword.toLocaleLowerCase('tr').trim().replace(/\s+/g, '')) {
        Notify({
          message: 'Aradığın cevap biz olabilir miyiz? - RadKod.com',
          color: 'var(--color-text-04)',
          background: 'var(--color-brand-radkod)'
        })

        radkodEasterEggSoundFx.play()

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
      window.localStorage.setItem('dailyMyAnswers', JSON.stringify(myAnswers.value))

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
      event.preventDefault()

      if (!isGameStarted.value) return false

      if (answer.isFocused) return false

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
      halfTime: null,
      radkodEasterEgg: null
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
      src: ['/sound/fx/pass.wav']
    })

    const halfTimeSoundFx = new Howl({
      src: ['/sound/fx/half-time.wav']
    })

    const radkodEasterEggSoundFx = new Howl({
      src: ['/sound/fx/radkod-easter-egg.mp3']
    })

    soundFx.start = startSoundFx
    soundFx.correct = correctSoundFx
    soundFx.wrong = wrongSoundFx
    soundFx.pass = passSoundFx
    soundFx.halfTime = halfTimeSoundFx
    soundFx.radkodEasterEgg = radkodEasterEggSoundFx

    const startGame = async () => {
      await nextTick()

      if (questions.value.length <= 0) return false

      if (isGameOver.value) return false

      setTimeout(() => {
        questionFitText()
      }, 0) // DOM Bypass

      const startGameToastMessage = `
          <img class='start-game-toast__spinner' src="${require('@/assets/img/core/loader.svg')}" />
          <div class="start-game-toast-info">
            <strong class='start-game-toast-info__title'>Bilmende fayda var</strong>
            <ul>
              <li>Oyunu erkenden sonlandırmak istersen <code>bitir</code> yazıp gönderebilirsin.</li>
            </ul>
          </div>
        `
      const toast = Toast.loading({
        type: 'html',
        className: 'start-game-toast',
        overlay: true,
        duration: 0, // continuous display toast
        forbidClick: true,
        message: `<h3 class='start-game-toast__countdown'>5</h3> \n ${startGameToastMessage}`
      })
      let second = 5
      const timer = setInterval(() => {
        second--

        if (second) {
          toast.message = `<h3 class='start-game-toast__countdown'>${second}</h3> \n ${startGameToastMessage}`
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

        window.localStorage.setItem('dailyCorrectAnswers', JSON.stringify([]))
        window.localStorage.setItem('dailyWrongAnswers', JSON.stringify([]))
        window.localStorage.setItem('dailyPassedAnswers', JSON.stringify([]))
        window.localStorage.setItem('dailyMyAnswers', JSON.stringify([]))
      }, 6000) // 5+1 second sleep
    }

    const endGame = async () => {
      await nextTick()

      store.commit('daily/SET_IS_GAME_OVER', {
        isGameOver: true
      })
      countdownTimerRef.value.pause()
      dialog.stats.isOpen = true

      setTimeout(() => {
        dialog.interstitialAd.isOpen = true
      }, 1000)
    }

    const listenCountdown = async timeData => {
      let days = timeData.days * 24 * 60 * 60 * 1000
      let hours = timeData.hours * 60 * 60 * 1000
      let minutes = timeData.minutes * 60 * 1000
      let seconds = timeData.seconds * 1000
      let milliseconds = timeData.milliseconds

      let remainTime = days + hours + minutes + seconds + milliseconds

      await store.commit('daily/UPDATE_COUNTDOWN_TIMER', remainTime)
      await window.localStorage.setItem('dailyRemainTime', `${timeData.minutes}:${timeData.seconds}`)
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

    const isTouchEnabled = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    }

    const acceptsInput = elem => {
      if (!elem) {
        return false
      }

      let tag = elem.tagName

      return tag == 'INPUT' || tag == 'SELECT' || tag == 'TEXTAREA' || elem.isContentEditable || elem.tabIndex >= 0
    }

    const handleDontHideKeyboard = event => {
      let target = event.target
      let dontDiscardKeyboard = target.classList.contains('do-not-hide-keyboard')

      let isPassButton = target.classList.contains('do-not-hide-keyboard--pass')
      let isSendButton = target.classList.contains('do-not-hide-keyboard--send')

      // On iOS tapping anywhere doesn’t
      // automatically discard keyboard
      if (dontDiscardKeyboard) {
        event.preventDefault()

        // DO ACTION HERE
        if (isPassButton) {
          pass()
        }

        if (isSendButton) {
          handleAnswer()
        }
      } else if (!acceptsInput(target)) {
        document.activeElement.blur()
      }
    }

    const checkUnsupportedHeight = () => {
      if (window.innerHeight < UNSUPPORTED_HEIGHT) {
        document.documentElement.classList.add('unsupported-height')

        setTimeout(() => {
          Notify({
            message: 'Daha iyi bir deneyim için daha büyük bir ekranda oynamalısın.',
            color: 'var(--color-text-04)',
            background: 'var(--color-warning-01)'
          })
        }, 1000)
      }
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

      if (isTouchEnabled) {
        rootRef.value.addEventListener('touchend', event => handleDontHideKeyboard(event))
      }

      // Unsupported screen height
      checkUnsupportedHeight()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', questionFitText)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      window.removeEventListener('scroll', scrollTop)

      if (isTouchEnabled) {
        rootRef.value.removeEventListener('touchend', handleDontHideKeyboard)
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
      countdown,
      countdownTimerRef,
      alphabetItemClasses,
      pass,
      handleAnswerField,
      handleAnswer,
      resetAnswer,
      startGame,
      listenCountdown,
      handleCountdownFinish,
      isTouchEnabled
    }
  }
})
</script>

<style lang="scss" src="./DailyModeGameScene.component.scss"></style>
