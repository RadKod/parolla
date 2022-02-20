<template lang="pug">
.game-scene
  // App Header
  AppHeader

  main.game-scene__main
    .alphabet
      .alphabet__inner
        template(v-for="(item, index) in alphabet.items")
          .alphabet__item(:class="[alphabetItemClasses(item, index)]") {{ item.letter }}

    button(@click="pass") Pas
    button(@click="handleAnswer(true)") Correct
    button(@click="handleAnswer(false)") Wrong
</template>

<script>
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { AppHeader } from '@/components/Header'

export default defineComponent({
  components: {
    AppHeader
  },
  setup() {
    const alphabet = reactive({
      activeIndex: 4,
      items: [
        {
          letter: 'A',
          isPassed: false,
          isWrong: true,
          isCorrect: false
        },
        {
          letter: 'B',
          isPassed: true,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'C',
          isPassed: false,
          isWrong: true,
          isCorrect: false
        },
        {
          letter: 'Ç',
          isPassed: false,
          isWrong: false,
          isCorrect: true
        },
        {
          letter: 'D',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'E',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'F',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'G',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'H',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'I',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'İ',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'J',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'K',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'L',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'M',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'N',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'O',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'Ö',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'P',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'R',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'S',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'T',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'U',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'Ü',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'V',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'Y',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        },
        {
          letter: 'Z',
          isPassed: false,
          isWrong: false,
          isCorrect: false
        }
      ]
    })

    const alphabetItemClasses = (item, index) => {
      if (index === alphabet.activeIndex) {
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
      let index = alphabet.items.findIndex(item => !item.isPassed && !item.isWrong && !item.isCorrect)

      if (index !== -1) {
        return index
      }

      const passedItems = alphabet.items.filter(item => item.isPassed)
      const totalPassed = passedItems.length

      if (totalPassed === 1) {
        return alphabet.items.indexOf(passedItems[0])
      }

      for (let i = alphabet.activeIndex; i < alphabet.items.length + alphabet.activeIndex; i++) {
        if (i === alphabet.activeIndex) continue

        const element = alphabet.items[i % alphabet.items.length]
        console.log(element, i % alphabet.items.length)

        if (element.isPassed) {
          index = i % alphabet.items.length
          break
        }
      }

      return index
    }

    const pass = () => {
      alphabet.items[alphabet.activeIndex].isPassed = true
      alphabet.activeIndex = nextLetter()
    }

    const handleAnswer = isCorrect => {
      const item = alphabet.items[alphabet.activeIndex]

      item.isPassed = false

      if (isCorrect) {
        item.isCorrect = true
      } else {
        item.isWrong = true
      }

      alphabet.activeIndex = nextLetter()
    }

    return { alphabet, alphabetItemClasses, pass, handleAnswer }
  }
})
</script>

<style lang="scss" src="./GameScene.component.scss"></style>
