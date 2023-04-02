import { useContext, useStore, ref, reactive, computed, watch, nextTick } from '@nuxtjs/composition-api'
import { ALPHABET_LENGTH, UNSUPPORTED_HEIGHT } from '@/system/constant'
import { gameModeKeyEnum } from '@/enums'
import { useGameMode } from '@/hooks'
// Swiper
import Swiper from 'swiper'
import 'swiper/swiper-bundle.min.css'
// Howler
import { Howl } from 'howler'
// Textfit
import textfit from 'textfit'
// Vant
import { Notify, Toast } from 'vant'

export default () => {
  const context = useContext()
  const store = useStore()

  const { activeGameMode } = useGameMode()

  const rootRef = ref(null)
  const setRootRef = element => {
    rootRef.value = element
  }

  const isGameStarted = ref(false)

  const isGameOver = computed(() => store.getters[`${activeGameMode.value}/isGameOver`])

  watch(isGameOver, async value => {
    if (value) {
      await nextTick()
      await endGame()
    }
  })

  const calculateStats = async () => {
    const correctAnswers = await store.getters[`${activeGameMode.value}/correctAnswers`]
    const wrongAnswers = await store.getters[`${activeGameMode.value}/wrongAnswers`]
    const passedAnswers = await store.getters[`${activeGameMode.value}/passedAnswers`]

    window.localStorage.setItem(`${activeGameMode.value}CorrectAnswers`, JSON.stringify(correctAnswers))
    window.localStorage.setItem(`${activeGameMode.value}WrongAnswers`, JSON.stringify(wrongAnswers))
    window.localStorage.setItem(`${activeGameMode.value}PassedAnswers`, JSON.stringify(passedAnswers))
  }

  const alphabet = computed(() => store.getters[`${activeGameMode.value}/alphabet`])

  watch(
    () => alphabet.value.activeIndex,
    async value => {
      await store.commit(`${activeGameMode.value}/SET_ALPHABET_ACTIVE_INDEX`, value)
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

  const questions = computed(() => store.getters[`${activeGameMode.value}/questions`])

  const countdown = computed(() => store.getters[`${activeGameMode.value}/countdown`])

  const countdownTimerRef = ref(false)

  const answer = reactive({
    field: '',
    isFocused: false
  })

  const myAnswers = ref([])
  watch(
    () => myAnswers.value,
    currentValue => {
      const passedAnswers = store.getters[`${activeGameMode.value}/passedAnswers`]

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
    window.localStorage.setItem(`${activeGameMode.value}MyAnswers`, JSON.stringify(myAnswers.value))

    alphabet.value.activeIndex = nextLetter()
  }

  const handleAnswerField = $event => {
    answer.field = $event.target.value
  }

  watch(
    () => answer.isFocused,
    value => {
      if (value) {
        document.querySelector('html').classList.add('osk')
        questionFitText()
      } else {
        document.querySelector('html').classList.remove('osk')
      }
    }
  )

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

  const pass = () => {
    if (isGameOver.value) return false

    alphabet.value.items[alphabet.value.activeIndex].isPassed = true

    myAnswers.value.push({ ...alphabet.value.items[alphabet.value.activeIndex], field: answer.field })
    window.localStorage.setItem(`${activeGameMode.value}MyAnswers`, JSON.stringify(myAnswers.value))

    alphabet.value.activeIndex = nextLetter()

    soundFx.pass.play()
  }

  const carousels = reactive({
    alphabet: {}
  })

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

    if (activeGameMode.value === gameModeKeyEnum.DAILY) {
      if (isGameOver.value) return false

      await store.commit('daily/RESET_COUNTDOWN_TIMER')
      await store.commit('daily/RESET_ALPHABET')
    }

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

      window.localStorage.setItem(`${activeGameMode.value}CorrectAnswers`, JSON.stringify([]))
      window.localStorage.setItem(`${activeGameMode.value}WrongAnswers`, JSON.stringify([]))
      window.localStorage.setItem(`${activeGameMode.value}PassedAnswers`, JSON.stringify([]))
      window.localStorage.setItem(`${activeGameMode.value}MyAnswers`, JSON.stringify([]))
    }, 6000) // 5+1 second sleep
  }

  const endGame = async () => {
    await nextTick()

    store.commit(`${activeGameMode.value}/SET_IS_GAME_OVER`, {
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

    await store.commit(`${activeGameMode.value}/UPDATE_COUNTDOWN_TIMER`, remainTime)

    if (activeGameMode.value === gameModeKeyEnum.DAILY) {
      await window.localStorage.setItem('dailyRemainTime', remainTime)
    }

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

  const questionFitText = async () => {
    await nextTick()

    textfit(rootRef.value.querySelectorAll('.question--active')[0], {
      minFontSize: 16,
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

  const handlePopState = () => {
    window.addEventListener('popstate', () => {
      window.location.href = window.origin
    })
  }

  return {
    setRootRef,
    isGameStarted,
    isGameOver,
    alphabet,
    alphabetItemClasses,
    questions,
    answer,
    countdown,
    countdownTimerRef,
    myAnswers,
    calculateStats,
    nextLetter,
    handleAnswer,
    handleAnswerField,
    handleTabKey,
    pass,
    carousels,
    initCarousels,
    dialog,
    soundFx,
    startGame,
    endGame,
    listenCountdown,
    handleCountdownFinish,
    questionFitText,
    handleBeforeUnload,
    scrollTop,
    isTouchEnabled,
    handleDontHideKeyboard,
    handlePopState,
    checkUnsupportedHeight
  }
}