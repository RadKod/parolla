<template lang="pug">
.scene.game-scene
  // Alphabet
  .alphabet.value.swiper.alphabet-carousel
    .alphabet__inner.swiper-wrapper
      .swiper-slide(v-for="(item, index) in alphabet.items")
        .alphabet__item(:class="[alphabetItemClasses(item, index)]") {{ item.letter }}

  // Countdown
  .countdown(:class="{ 'd-none': fetchState.pending || fetchState.error }")
    Icon.countdown__icon(name="clock-o")
    CountDown.countdown__timer(ref="countdownTimerRef" format="mm:ss" :auto-start="false" :time="countdown.time")

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
</template>

<script>
import { defineComponent, useStore, ref, reactive, computed, onMounted, nextTick, watch, useFetch } from '@nuxtjs/composition-api'
import { Button, Field, Empty, CountDown, Icon } from 'vant'
// Swiper
import Swiper from 'swiper'
import 'swiper/swiper-bundle.min.css'

export default defineComponent({
  components: {
    Button,
    Field,
    Empty,
    CountDown,
    Icon
  },
  setup() {
    const store = useStore()

    const hasStarted = computed(() => store.getters['game/hasStarted'])
    watch(hasStarted, async value => {
      if (value) {
        await nextTick()
        await startGame()
      }
    })

    const alphabet = computed(() => store.getters['game/alphabet'])

    const questions = computed(() => store.getters['game/questions'])
    watch(questions, async value => {
      if (value.length > 0) {
        await store.commit('game/SET_HAS_STARTED', {
          hasStarted: true
        })
      }
    })

    const countdown = computed(() => store.getters['game/countdown'])

    const countdownTimerRef = ref(false)

    const answer = reactive({
      field: ''
    })

    const carousels = reactive({
      alphabet: {}
    })

    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('game/fetchQuestions')
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
        console.log(element, i % alphabet.value.items.length)

        if (element.isPassed) {
          index = i % alphabet.value.items.length
          break
        }
      }

      return index
    }

    const pass = () => {
      alphabet.value.items[alphabet.value.activeIndex].isPassed = true
      alphabet.value.activeIndex = nextLetter()

      carousels.alphabet.slideTo(alphabet.value.activeIndex)
      resetAnswer()
    }

    const handleAnswer = () => {
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

      if (questions.value.length > 0) {
        setTimeout(() => {
          countdownTimerRef.value.start()
        }, 1000) // 1second sleep
      }
    }

    onMounted(() => {
      initCarousels()
    })

    return {
      fetch,
      fetchState,
      hasStarted,
      alphabet,
      questions,
      answer,
      countdown,
      countdownTimerRef,
      alphabetItemClasses,
      pass,
      handleAnswer,
      resetAnswer
    }
  }
})
</script>

<style lang="scss" src="./GameScene.component.scss"></style>
