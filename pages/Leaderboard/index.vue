<template lang="pug">
.page.leaderboard-page
  .leaderboard-page-header
    h1.leaderboard-page-header__title.mb-base {{ $t('leaderboard.modeTitle', { mode: $t('introScene.modeList.tour.title') }) }}
    p.leaderboard-page-header__description.mb-base {{ pageDescription }}

  .button-group
    Button(type="primary" size="small" :class="{ active: activeLeaderboardType === 'daily' }" @click="fetchLeaderboard('daily')")
      | {{ $t('leaderboard.daily.short') }}

    Button(type="primary" size="small" :class="{ active: activeLeaderboardType === 'weekly' }" @click="fetchLeaderboard('weekly')")
      | {{ $t('leaderboard.weekly.short') }}

    Button(type="primary" size="small" :class="{ active: activeLeaderboardType === 'monthly' }" @click="fetchLeaderboard('monthly')")
      | {{ $t('leaderboard.monthly.short') }}

    Button(type="primary" size="small" :class="{ active: activeLeaderboardType === 'allTime' }" @click="fetchLeaderboard('allTime')")
      | {{ $t('leaderboard.allTime.short') }}

  template(v-if="fetchState.pending")
    Empty(:description="$t('leaderboard.pending')")

  template(v-else-if="fetchState.error")
    Empty(image="error" :description="$t('leaderboard.error')")
      Button(@click="fetch") {{ $t('leaderboard.error.action') }}

  template(v-else)
    template(v-if="leaderboard.length > 0")
      Leaderboard(:scorers="leaderboard")
    template(v-else)
      Empty(:description="$t('leaderboard.empty.description')")
</template>

<script lang="ts">
import { defineComponent, ref, useStore, useFetch, computed } from '@nuxtjs/composition-api'
import { Empty, Button } from 'vant'

export default defineComponent({
  name: 'LeaderboardPage',
  components: {
    Empty,
    Button
  },
  layout: 'Default/Default.layout',
  setup() {
    const store = useStore()

    const activeLeaderboardType = ref('daily')

    const leaderboard = computed(() => store.getters['tour/leaderboard'])

    const fetchLeaderboard = async type => {
      activeLeaderboardType.value = type
      await fetch()
    }

    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('tour/fetchLeaderboard', { period: activeLeaderboardType.value, limit: 100 })
    })

    const pageDescription = computed(() => {
      if (activeLeaderboardType.value === 'daily') {
        return `Bugün kazanılan puanlar`
      } else if (activeLeaderboardType.value === 'weekly') {
        return `Bu hafta kazanılan puanlar`
      } else if (activeLeaderboardType.value === 'monthly') {
        return `Bu ay kazanılan puanlar`
      } else if (activeLeaderboardType.value === 'allTime') {
        return `Şu ana kadar toplanılan tüm puanlar`
      }
    })

    return {
      fetch,
      fetchState,
      fetchLeaderboard,
      leaderboard,
      activeLeaderboardType,
      pageDescription
    }
  }
})
</script>

<style lang="scss" src="./Leaderboard.page.scss"></style>
