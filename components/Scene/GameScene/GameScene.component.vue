<template lang="pug">
.scene.game-scene(:class="{ 'game-scene--gameOver': isGameOver }")
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
        .question(v-for="(question, index) in questions")
          strong.question__title(v-if="index === alphabet.activeIndex") {{ question.question }}

      // Pass Button
      Button.pass-button(color="var(--color-warning-01)" size="small" plain round @click="pass") Pas

      // Answer Field
      Field.answer-field(v-model="answer.field" type="text" placeholder="Cevabını yaz" spellcheck="false" @keypress.enter="handleAnswer")
        template(#button)
          Button.answer-field__button(
            color="var(--color-brand-02)"
            icon="guide-o"
            size="small"
            round
            :disabled="answer.field <= 0"
            @click="handleAnswer"
          )

  // Stats Dialog
  StatsDialog(:isOpen="dialog.stats.isOpen")
</template>

<script>
import { defineComponent, useStore, useFetch, ref, reactive, computed, onMounted, nextTick, watch } from '@nuxtjs/composition-api'
import { Button, Field, Empty, CountDown, Icon, Notify, Toast } from 'vant'
import { StatsDialog } from '@/components/Dialog'
// Swiper
import Swiper from 'swiper'
import 'swiper/swiper-bundle.min.css'

export default defineComponent({
  components: {
    Button,
    Field,
    Empty,
    CountDown,
    Icon,
    StatsDialog
  },
  setup() {
    const store = useStore()

    const isGameOver = computed(() => store.getters['game/isGameOver'])

    // When game is over
    watch(isGameOver, async value => {
      if (value) {
        await nextTick()
        await endGame()
      }
    })

    const alphabet = computed(() => store.getters['game/alphabet'])
    watch(
      () => alphabet.value.activeIndex,
      async value => {
        await store.commit('game/SET_ALPHABET_ACTIVE_INDEX', value)
      }
    )

    const questions = computed(() => store.getters['game/questions'])
    watch(questions, async value => {
      if (value.length > 0) {
        if (!isGameOver.value) {
          await startGame()
        }
      }
    })

    const countdown = computed(() => store.getters['game/countdown'])

    const countdownTimerRef = ref(false)

    const answer = reactive({
      field: ''
    })

    const dialog = reactive({
      stats: {
        isOpen: false
      }
    })

    const carousels = reactive({
      alphabet: {}
    })

    const { fetch, fetchState } = useFetch(async () => {
      if (process.client) {
        const persistStore = JSON.parse(window.localStorage.getItem('vuex'))

        const day = 2
        const storeDay = 1

        if (day === storeDay) {
          await console.log('From localstorage')
          await store.commit('game/SET_QUESTIONS', {
            questions: persistStore.game.questions
          })
        } else {
          await console.log('From api')
          await store.dispatch('game/fetchQuestions')
        }
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

      carousels.alphabet.slideTo(alphabet.value.activeIndex)
      resetAnswer()
    }

    const handleAnswer = () => {
      if (isGameOver.value) return false

      const item = alphabet.value.items[alphabet.value.activeIndex]

      item.isPassed = false

      if (answer.field.toLocaleLowerCase('tr') === questions.value[alphabet.value.activeIndex].answer.correct.toLocaleLowerCase('tr')) {
        item.isCorrect = true
      } else {
        item.isWrong = true
      }

      resetAnswer()

      alphabet.value.activeIndex = nextLetter()
      carousels.alphabet.slideTo(alphabet.value.activeIndex)
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

    const startGame = async () => {
      await nextTick()

      setTimeout(() => {
        countdownTimerRef.value.start()
      }, 1000) // 1second sleep
    }

    const endGame = async () => {
      await nextTick()

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
      await store.commit('game/SET_IS_GAME_OVER', {
        isGameOver: true
      })
    }

    onMounted(() => {
      initCarousels()

      // Check game over
      if (isGameOver.value) {
        endGame()
      }
    })

    return {
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
      listenCountdown,
      handleCountdownFinish
    }
  }
})
</script>

<style lang="scss" src="./GameScene.component.scss"></style>
