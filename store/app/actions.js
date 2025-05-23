import WebSocket from 'isomorphic-ws'

export default {
  initWs({ commit, dispatch }) {
    let retryInterval = null

    const connect = () => {
      const token = this.$auth.strategy.token.get()
      const wsUrl = `${process.env.WS_URL}?token=${token}`

      // Create WebSocket instance
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.info('Connected to WebSocket server')

        // Clear retry interval when connection is successful
        if (retryInterval) {
          clearInterval(retryInterval)
          retryInterval = null
        }
      }

      ws.onclose = () => {
        console.info('Disconnected from WebSocket server')
      }

      ws.onerror = error => {
        console.error('WebSocket error:', error)

        // Only set up interval if it's not already running
        if (!retryInterval) {
          retryInterval = setInterval(() => {
            dispatch('initWs')
          }, 3000) // Retry every 3 seconds
        }
      }

      commit('SET_WS', ws)
    }

    connect()
  },

  closeWs({ commit, state }) {
    if (state.ws) {
      state.ws.close(1000, 'Client disconnecting')
    }
    commit('SET_WS', null)
  }
}
