export default {
  async fetchLeaderboard({ commit }, { type, limit }) {
    const leaderboardResponse = await fetch(`${process.env.API}/tour/leaderboard?type=${type}&limit=${limit}`, {
      method: 'get',
      headers: {
        'Accept-Language': this.$i18n.locale
      }
    })
    const leaderboardResult = await leaderboardResponse.json()

    commit('SET_LEADERBOARD', leaderboardResult.data)

    console.log('leaderboardResult', leaderboardResult.data)
  }
}
