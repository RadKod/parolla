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
        commit('SET_USER_LIST', { players, totalCount, totalViewers: viewerCount })
      }

      dispatch('emitWebSocketEvent', { type, data: parsedData })
    }
  },

  async fetchLeaderboard({ commit }, { period = 'allTime', limit = 10 }) {
    const { data, error } = await this.$appFetch({
      path: `tour-scores/tour-leaderboard`,
      query: {
        period,
        limit
      }
    })

    if (data) {
      commit('SET_LEADERBOARD', data.data)
    }

    return {
      data,
      error
    }
  },

  emitWebSocketEvent({ commit }, { type, data }) {
    window.dispatchEvent(
      new CustomEvent('ws-event', {
        detail: { type, data }
      })
    )
  }
}
