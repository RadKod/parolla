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

      await dispatch('app/initWs')
      await dispatch('tour/listenWs', { ws: getters['app/ws'] })
    }
  }
}

export const strict = false
