<template lang="pug">
.page.leaderboard-page
  .leaderboard-page-header
    h1.leaderboard-page-header__title.mb-base.pb-base {{ $t('leaderboard.modeTitle', { mode: $t('introScene.modeList.tour.title') }) }}

  .button-group
    Button(type="primary" size="small" :class="{ active: activeLeaderboardType === 'monthly' }" @click="fetchLeaderboard('monthly')")
      | {{ $t('leaderboard.monthly.short') }}

    Button(type="primary" size="small" :class="{ active: activeLeaderboardType === 'weekly' }" @click="fetchLeaderboard('weekly')")
      | {{ $t('leaderboard.weekly.short') }}

    Button(type="primary" size="small" :class="{ active: activeLeaderboardType === 'daily' }" @click="fetchLeaderboard('daily')")
      | {{ $t('leaderboard.daily.short') }}

  template(v-if="fetchState.pending")
    Empty(:description="$t('leaderboard.pending')")

  template(v-else-if="fetchState.error")
    Empty(image="error" :description="$t('leaderboard.error')")
      Button(@click="fetch") {{ $t('leaderboard.error.action') }}

  template(v-else)
    template(v-if="leaderboard[activeLeaderboardType].length > 0")
      Leaderboard(:scorers="leaderboard[activeLeaderboardType]")
    template(v-else)
      Empty(:description="$t('leaderboard.empty.description')")
</template>

<script lang="ts">
import { defineComponent, ref, useStore, useContext, useRouter, onMounted, useFetch, computed } from '@nuxtjs/composition-api'
const { getQuery } = require('ufo')
import { Empty, Button } from 'vant'

export default defineComponent({
  name: 'LeaderboardPage',
  components: {
    Empty,
    Button
  },
  layout: 'Default/Default.layout',
  setup() {
    const query = getQuery(window.location.href)
    const context = useContext()
    const store = useStore()
    const router = useRouter()

    const activeLeaderboardType = ref('monthly')

    const leaderboard = computed(() => store.getters['tour/leaderboard'])

    const fetchLeaderboard = async type => {
      activeLeaderboardType.value = type
      await fetch()
    }

    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('tour/fetchLeaderboard', { type: activeLeaderboardType.value, limit: 100 })
    })

    return {
      fetch,
      fetchState,
      fetchLeaderboard,
      leaderboard,
      activeLeaderboardType
    }
  }
})
</script>

<style lang="scss" src="./Leaderboard.page.scss"></style>
