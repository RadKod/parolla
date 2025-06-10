import WebSocket from 'isomorphic-ws'

export default {
  initWs({ commit }) {
    const token = this.$auth.strategy.token.get()
    const wsUrl = `${process.env.WS_URL}?token=${token}`

    // Create WebSocket instance
    const ws = new WebSocket(wsUrl)

    commit('SET_WS', ws)
  },

  closeWs({ commit, state }) {
    if (state.ws) {
      state.ws.close(1000, 'Client disconnecting')
    }

    commit('SET_WS', null)
  }
}
