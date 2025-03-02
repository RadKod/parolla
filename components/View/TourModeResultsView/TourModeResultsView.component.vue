<template lang="pug">
.tour-mode-results-view
  canvas#canvas-confetti.confetti-canvas

  .tour-mode-results-view__inner
    .tour-mode-results-view-header
      .tour-mode-results-view-header__title
        | {{ $t('tourMode.results.title') }}

    .tour-mode-results-view-correct-answer
      span.tour-mode-results-view-correct-answer__title {{ $t('tourMode.results.correctAnswer') }}
      span.tour-mode-results-view-correct-answer__answer {{ tour.correctAnswer }}

    Leaderboard(:scorers="scorers")

    Button.tour-mode-results-view-waiting(loading :loading-text="`Yeni tur başlamadan önce ${tour.waitingNextSeconds} saniye bekleyiniz.`")
</template>

<script>
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
import { Button } from 'vant'
import confetti from 'canvas-confetti'

export default defineComponent({
  name: 'TourModeResultsView',
  components: {
    Button
  },
  props: {
    tour: {
      type: Object,
      required: true
    }
  },
  setup() {
    const scorers = ref([
      ...Array.from({ length: 10 }, (_, index) => ({
        username: `gamer${5135 + index}`,
        fingerprint: 5616516531 + index,
        score: `+${10 - index}`,
        time: `00:09:${992 + index}`,
        rank: index + 1
      }))
    ])

    const setConfettiCanvas = () => {
      const myCanvas = document.getElementById('canvas-confetti')

      // Set canvas size and position
      myCanvas.style.position = 'absolute'
      myCanvas.style.top = '0'
      myCanvas.style.left = '0'
      myCanvas.style.width = '100%'
      myCanvas.style.height = '100%'
      myCanvas.style.pointerEvents = 'none'
      myCanvas.style.zIndex = '999'
    }

    const explodeConfetti = () => {
      const defaults = {
        scalar: 1,
        spread: 180,
        particleCount: 100,
        origin: { y: -0.1 },
        startVelocity: -35
      }

      confetti(defaults)
    }

    onMounted(() => {
      setConfettiCanvas()

      explodeConfetti()
    })

    return {
      scorers
    }
  }
})
</script>

<style lang="scss" src="./TourModeResultsView.component.scss"></style>
