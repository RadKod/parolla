<template lang="pug">
.tour-mode-results-view
  canvas#canvas-confetti.confetti-canvas

  .tour-mode-results-view__inner
    .tour-mode-results-view-header
      .tour-mode-results-view-header__title
        | {{ $t('tourMode.results.title') }}

    .tour-mode-results-view-correct-answer
      span.tour-mode-results-view-correct-answer__title {{ $t('tourMode.results.correctAnswer') }}
      span.tour-mode-results-view-correct-answer__answer Ödeme yapma, Ödeme yapmak, Ödeme, Ödemek

    .top-scorer-list
      .top-scorer-list-item(v-for="(scorer, index) in scorers.slice(0, 3)" :key="scorer.username" :data-rank="index + 1")
        PlayerAvatar(with-username :size="48" :user="scorer")

        .top-scorer-list-item-score(v-if="scorer.score")
          span.top-scorer-list-item-score__value
            strong +{{ scorer.score }}
            | puan

        .top-scorer-list-item-time(v-if="scorer.time")
          AppIcon.top-scorer-list-item-time__icon(name="tabler:clock" :width="16" :height="16")
          span.top-scorer-list-item-time__value
            strong {{ scorer.time.split(':')[0] }}
            | :
            strong {{ scorer.time.split(':')[1] }}
            | .
            sub {{ scorer.time.split(':')[2] }}

        .top-scorer-list-item-rank
          .top-scorer-list-item-rank__number {{ index + 1 }}

    TourModeUserList(:items="scorers.slice(3)")

    Button.tour-mode-results-view-waiting(loading loading-text=`Yeni tur başlamadan önce ${'10'} saniye bekleyiniz.`)
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
  setup() {
    const scorers = ref([
      ...Array.from({ length: 10 }, (_, index) => ({
        username: `gamer${5135 + index}`,
        fingerprint: 5616516531 + index,
        score: 10 - index,
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
