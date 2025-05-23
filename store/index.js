export const actions = {
  async nuxtClientInit({ dispatch, commit, getters }) {
    if (process.browser) {
      await dispatch('auth/generateFingerprint')

      const fetchMeResult = await dispatch('auth/fetchMe')

      if (fetchMeResult.success) {
        commit('auth/SET_USER', fetchMeResult.data)
      } else {
        const updateUserResult = await dispatch('auth/updateUser')

        if (updateUserResult.success) {
          commit('auth/SET_USER', updateUserResult.data)
        }
      }

      const connectWs = async () => {
        // TODO: Remove this after tour mode socket channel is implemented
        await dispatch('app/initWs')
        await dispatch('tour/listenWs', { ws: getters['app/ws'] })
      }

      await connectWs()

      document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
          console.info('The page has become visible')

          if (getters['app/ws'].readyState !== WebSocket.OPEN) {
            console.info('The page has become visible, reconnecting...')

            await connectWs()
          }
        }
      })
    }
  }
}

export const strict = false
