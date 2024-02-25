<template lang="pug">
Collapse.list.scoreboard-list(v-model="toggledScoreItem" accordion)
  CollapseItem.scoreboard-list-item(v-for="(item, index) in items" :key="index" :disabled="!item.result.gamersAnswers")
    template(#title)
      .scoreboard-list-item-user
        strong.scoreboard-list-item-user__username
          template(v-if="item.user")
            PlayerAvatar(:size="20" :name="item.user.fingerprint")
            span {{ item.user.username }}
          template(v-else)
            template(v-if="item.fingerprint")
              PlayerAvatar(:size="20" :name="item.fingerprint")
              span {{ item.fingerprint }}
            template(v-else)
              span -
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
          template(v-if="getGamerAnswer({ item, questionIndex })?.field.length > 0")
            | {{ getGamerAnswer({ item, questionIndex }).field.toLocaleUpperCase('tr') }}
          template(v-else) -

    template(v-else)
      p {{ $t('general.noData') }}
</template>

<script>
import { defineComponent, useStore, ref, computed } from '@nuxtjs/composition-api'
import { Collapse, CollapseItem, Empty, Button } from 'vant'
import { PlayerAvatar } from '@/components/Avatar'

export default defineComponent({
  components: {
    Collapse,
    CollapseItem,
    Empty,
    Button,
    PlayerAvatar
  },
  props: {
    items: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  setup() {
    const store = useStore()

    const questions = computed(() => store.getters['creator/questions'])

    const toggledScoreItem = ref([0])

    const getGamerAnswer = ({ item, questionIndex }) => {
      return item.result.gamersAnswers?.find(answer => answer.index === questionIndex)
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
      getGamerAnswer,
      getGamerAnswerClasses
    }
  }
})
</script>

<style lang="scss" src="./ScoreboardList.component.scss"></style>
