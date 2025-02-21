<template lang="pug">
.tour-mode-user-list
  Cell.tour-mode-user-list-item(v-for="i in 876" :key="i")
    template(#title)
      .tour-mode-user-list-item-user
        strong.tour-mode-user-list-item-user__username
          template(v-if="user")
            PlayerAvatar(:size="20" :name="user.fingerprint")
            span {{ user.username }}
          template(v-else)
            template(v-if="user.fingerprint")
              PlayerAvatar(:size="20" :name="user.fingerprint")
              span {{ user.fingerprint }}
            template(v-else)
              span -
      .tour-mode-user-list-item-score
        span.tour-mode-user-list-item-score__value
          strong 1286
          | puan
</template>

<script>
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'
import { Cell } from 'vant'

export default defineComponent({
  name: 'TourModeUserList',
  components: {
    Cell
  },
  setup() {
    const store = useStore()

    const user = computed(() => store.getters['auth/user'])

    return {
      user
    }
  }
})
</script>

<style lang="scss" src="./TourModeUserList.component.scss"></style>
