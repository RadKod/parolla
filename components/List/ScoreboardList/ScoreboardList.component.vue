<template lang="pug">
List.list.scoreboard-list
  Cell.scoreboard-list-item(v-for="(item, index) in items" :key="index")
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
      strong.scoreboard-list-item-result__item {{ item.result.remainTime.minutes }}:{{ item.result.remainTime.seconds }}
      strong.scoreboard-list-item-result__item 🟩 {{ item.result.correctAnswers.length }}
      strong.scoreboard-list-item-result__item 🟥 {{ item.result.wrongAnswers.length }}
      strong.scoreboard-list-item-result__item 🟨 {{ item.result.passedAnswers.length }}
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { List, Cell, Empty, Button } from 'vant'
import { PlayerAvatar } from '@/components/Avatar'

export default defineComponent({
  components: {
    List,
    Cell,
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
  setup() {}
})
</script>

<style lang="scss" src="./ScoreboardList.component.scss"></style>
