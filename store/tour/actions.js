import { wsTypeEnum } from '@/enums'

export default {
  async listenWs({ commit, dispatch }, { ws }) {
    ws.onmessage = data => {
      const parsedData = JSON.parse(data.data)
      const { type, players, totalCount, viewerCount, chatHistory, question } = parsedData

      if (type === wsTypeEnum.TOUR_QUESTION) {
        commit('SET_TOUR', {
          question: {
            letter: question.letter,
            question: question.question
          }
        })
      }

      if (type === wsTypeEnum.CONNECTED) {
        commit('SET_CHAT_MESSAGES', chatHistory)
      }

      if (type === wsTypeEnum.TOUR_USER_LIST) {
        console.log('players', players)
        commit('SET_USER_LIST', { players, totalCount, totalViewers: viewerCount })
      }

      dispatch('emitWebSocketEvent', { type, data: parsedData })
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
  },

  emitWebSocketEvent({ commit }, { type, data }) {
    window.dispatchEvent(
      new CustomEvent('ws-event', {
        detail: { type, data }
      })
    )
  }
}
