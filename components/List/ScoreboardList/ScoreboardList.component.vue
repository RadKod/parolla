<template lang="pug">
Collapse.list.scoreboard-list(v-model="toggledScoreItem" accordion)
  CollapseItem.scoreboard-list-item(v-for="(item, index) in items" :key="index" :disabled="!item.result.gamersAnswers")
    template(#title)
      .scoreboard-list-item-user
        strong.scoreboard-list-item-user__username
          PlayerAvatar(:size="20" :user="item.user")
          span {{ item.user.username }}

      .scoreboard-list-item-result
        strong.scoreboard-list-item-result__item
          template {{ item.result.remainTime.minutes }}:{{ item.result.remainTime.seconds }}
            sup .{{ item.result.remainTime.milliseconds }}
        strong.scoreboard-list-item-result__item 🟩 {{ item.result.correctAnswers.length }}
        strong.scoreboard-list-item-result__item 🟥 {{ item.result.wrongAnswers.length }}
        strong.scoreboard-list-item-result__item 🟨 {{ item.result.passedAnswers.length }}

    // Gamer answers
    ul.scoreboard-list-gamerAnswers(v-if="item.result.gamersAnswers")
      li.scoreboard-list-gamerAnswers-item(
        v-for="(question, questionIndex) in questions"
        :key="questionIndex"
        :class="[getGamerAnswerClasses(getGamerAnswer({ item, questionIndex }))]"
      )
        strong.scoreboard-list-gamerAnswers-item__letter {{ question.letter }}
        span.scoreboard-list-gamerAnswers-item__value
          kbd {{ question.answer }}
          span(v-if="getGamerAnswer({ item, questionIndex })?.isPassed") {{ $t('gameScene.pass').toLocaleUpperCase('tr') }}
          span(v-else-if="getGamerAnswer({ item, questionIndex })?.field?.length > 0")
            | {{ getGamerAnswer({ item, questionIndex })?.field?.toLocaleUpperCase('tr') }}
          span(v-else) -

    template(v-else)
      p {{ $t('general.noData') }}

  // InfiniteLoading(@infinite="handleInfiniteLoading")
</template>

<script>
import { defineComponent, useStore, ref, computed } from '@nuxtjs/composition-api'
import { Collapse, CollapseItem, Empty, Button } from 'vant'
import InfiniteLoading from 'vue-infinite-loading'

export default defineComponent({
  components: {
    Collapse,
    CollapseItem,
    Empty,
    Button,
    InfiniteLoading
  },
  props: {
    items: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const store = useStore()

    const questions = computed(() => store.getters['creator/questions'])

    const toggledScoreItem = ref([0])

    const handleInfiniteLoading = async $state => {
      await emit('on-infinite-loading', $state)
    }

    const getGamerAnswer = ({ item, questionIndex }) => {
      return item.result.gamersAnswers?.filter(answer => answer.index === questionIndex).reverse()[0]
    }

    const getGamerAnswerClasses = answer => {
      if (answer && Object.keys(answer).length > 0) {
        if (answer.isCorrect) {
          return 'answer--correct'
        }

        if (answer.isWrong) {
          return 'answer--wrong'
        }

        if (answer.isPassed) {
          return 'answer--passed'
        }
      } else {
        return null
      }
    }

    return {
      questions,
      toggledScoreItem,
      handleInfiniteLoading,
      getGamerAnswer,
      getGamerAnswerClasses
    }
  }
})
</script>

<style lang="scss" src="./ScoreboardList.component.scss"></style>
