import { wsTypeEnum } from '@/enums'

export default {
  async listenWs({ commit }, { ws }) {
    ws.onmessage = data => {
      const { type, players, totalCount, viewerCount, chatHistory, question } = JSON.parse(data.data)

      if (type === wsTypeEnum.CONNECTED) {
        commit('SET_CHAT_MESSAGES', chatHistory)
      }

      if (type === wsTypeEnum.TOUR_QUESTION) {
        commit('SET_TOUR', {
          question: {
            letter: question.letter,
            question: question.question
          }
        })
      }

      if (type === wsTypeEnum.TOUR_USER_LIST) {
        commit('SET_USER_LIST', { players, totalCount, totalViewers: viewerCount })
      }
    }
  },
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
