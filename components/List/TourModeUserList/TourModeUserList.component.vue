<template lang="pug">
.tour-mode-user-list
  Cell.tour-mode-user-list-item(v-for="item in items" :key="item.username")
    template(#title)
      .tour-mode-user-list-item-user
        strong.tour-mode-user-list-item-user__username
          PlayerAvatar(with-username :size="20" :user="item")

      .tour-mode-user-list-item-time(v-if="item.time")
        AppIcon.tour-mode-user-list-item-time__icon(name="tabler:clock" :width="16" :height="16")
        span.tour-mode-user-list-item-time__value
          strong {{ item.time.split(':')[0] }}
          | :
          strong {{ item.time.split(':')[1] }}
          | .
          sub {{ item.time.split(':')[2] }}

      .tour-mode-user-list-item-score(v-if="item.score")
        span.tour-mode-user-list-item-score__value
          strong +{{ item.score }}
          label puan

      .tour-mode-user-list-item-score(v-if="item.globalScore")
        span.tour-mode-user-list-item-score__value
          strong {{ item.globalScore }}
          label puan
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { Cell } from 'vant'

export default defineComponent({
  name: 'TourModeUserList',
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

<style lang="scss" src="./TourModeUserList.component.scss"></style>
