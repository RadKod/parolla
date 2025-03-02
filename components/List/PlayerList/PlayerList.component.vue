<template lang="pug">
.player-list
  Cell.player-list-item(v-for="item in items" :key="item.username")
    template(#title)
      .player-list-item-user
        strong.player-list-item-user__username
          PlayerAvatar(with-username :size="20" :user="item")

      .player-list-item-time(v-if="item.time")
        AppIcon.player-list-item-time__icon(name="tabler:clock" :width="16" :height="16")
        span.player-list-item-time__value
          strong {{ item.time.split(':')[0] }}
          | :
          strong {{ item.time.split(':')[1] }}
          | .
          sub {{ item.time.split(':')[2] }}

      .player-list-item-score(v-if="item.score")
        span.player-list-item-score__value
          strong {{ item.score }}
          label puan

      .player-list-item-score(v-if="item.globalScore")
        span.player-list-item-score__value
          strong {{ item.globalScore }}
          label puan
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { Cell } from 'vant'

export default defineComponent({
  name: 'PlayerList',
  components: {
    Cell
  },
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [
        ...Array.from({ length: 200 }, (_, index) => ({
          username: `gamer${5135 + index}`,
          fingerprint: 5616516531 + index,
          globalScore: 1286 + index,
          rank: index + 1
        }))
      ]
    }
  },
  setup() {}
})
</script>

<style lang="scss" src="./PlayerList.component.scss"></style>
