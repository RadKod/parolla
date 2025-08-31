const setUser = async ({ $auth, $cookies, dispatch }) => {
  const logout = async () => {
    await $auth.setStrategy('local')
    await $auth.setUserToken('')
    await $auth.setUser(null)
    await $auth.logout()

    await $cookies.remove('google_auth_callback_params')
    await $cookies.remove('google_auth_access_token')
    await $cookies.remove('google_auth_jwt_token')
  }

  if ($auth.strategy.name === 'local' && $auth.loggedIn) {
    const { data, error } = await dispatch('auth/fetchMe')

    if (data) {
      $auth.setUser(data)
    }

    if (error) {
      await logout()
    }
  }

  if ($cookies.get('auth._token.google')) {
    const { data, error } = await dispatch('auth/fetchMe')

    if (data) {
      await $auth.setStrategy('google')
      await $auth.setUserToken(`${$cookies.get('auth._token.google')}`)
      await $auth.setUser(data)
    }

    if (error) {
      await logout()
    }
  }
}

// WebSocket configuration
const WS_CONFIG = {
  maxReconnectAttempts: 5,
  reconnectDelay: 1000 // 1 second
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

export const actions = {
  async nuxtClientInit({ dispatch, commit, getters }, { $auth, $cookies }) {
    if (process.browser) {
      await setUser({ dispatch, commit, $auth, $cookies })
      await initializeWebSocket({ dispatch, getters })
    }
  }
}

export const strict = false
