export const actions = {
  async nuxtClientInit({ dispatch, commit, getters }) {
    if (process.browser) {
      await dispatch('auth/generateFingerprint')
      await handleUserAuthentication({ dispatch, commit })
      await initializeWebSocket({ dispatch, getters })
    }
  }
}

// WebSocket configuration
const WS_CONFIG = {
  maxReconnectAttempts: 5,
  reconnectDelay: 1000 // 1 second
}

// User authentication handling
async function handleUserAuthentication({ dispatch, commit }) {
  const fetchMeResult = await dispatch('auth/fetchMe')

  if (fetchMeResult.success) {
    commit('auth/SET_USER', fetchMeResult.data)
  } else {
    const updateUserResult = await dispatch('auth/updateUser')

    if (updateUserResult.success) {
      commit('auth/SET_USER', updateUserResult.data)
    }
  }
}

// WebSocket management
async function initializeWebSocket({ dispatch, getters }) {
  let reconnectAttempts = 0
  const getWs = () => getters['app/ws']

  const connectWs = async () => {
    try {
      await dispatch('app/initWs')
      await dispatch('tour/listenWs', { ws: getters['app/ws'] })
      reconnectAttempts = 0
      console.info('WebSocket connection established successfully')
    } catch (error) {
      handleConnectionError(error, reconnectAttempts, connectWs)
    }
  }

  const handleConnectionError = (error, attempts, retryFn) => {
    console.error('WebSocket connection failed:', error)

    if (attempts < WS_CONFIG.maxReconnectAttempts) {
      reconnectAttempts++
      console.info(`Attempting to reconnect (${reconnectAttempts}/${WS_CONFIG.maxReconnectAttempts})...`)
      setTimeout(retryFn, WS_CONFIG.reconnectDelay * reconnectAttempts)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  const setupWebSocketEventHandlers = ws => {
    ws.onopen = () => {
      console.info(`Connected to WebSocket server, readyState: ${JSON.stringify(ws.readyState)}`)
      reconnectAttempts = 0
    }

    ws.onclose = () => {
      console.info('Disconnected from WebSocket server')

      if (reconnectAttempts < WS_CONFIG.maxReconnectAttempts) {
        reconnectAttempts++
        console.info(`Attempting to reconnect (${reconnectAttempts}/${WS_CONFIG.maxReconnectAttempts})...`)
        setTimeout(connectWs, WS_CONFIG.reconnectDelay * reconnectAttempts)
      }
    }

    ws.onerror = error => {
      console.error('WebSocket error:', error)

      if (reconnectAttempts < WS_CONFIG.maxReconnectAttempts) {
        reconnectAttempts++
        console.info(`Attempting to reconnect after error (${reconnectAttempts}/${WS_CONFIG.maxReconnectAttempts})...`)
        setTimeout(connectWs, WS_CONFIG.reconnectDelay * reconnectAttempts)
      }
    }
  }

  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
      console.info(`Page became visible, checking WebSocket connection...`)

      if (getWs().readyState !== WebSocket.OPEN) {
        console.info('WebSocket not connected, attempting to reconnect...')
        reconnectAttempts = 0
        await connectWs()
      }
    }
  }

  // Initialize connection
  await connectWs()
  setupWebSocketEventHandlers(getWs())

  // Setup visibility handlers
  document.addEventListener('visibilitychange', handleVisibilityChange)
  document.addEventListener('focus', handleVisibilityChange)
}

export const strict = false
