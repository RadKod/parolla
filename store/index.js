export const actions = {
  async nuxtClientInit({ dispatch, commit }) {
    if (process.browser) {
      const persistStore = JSON.parse(window.localStorage.getItem('persistStore'))

      const storedFingerprint = persistStore && persistStore.auth?.user?.fingerprint

      if (!storedFingerprint || storedFingerprint.length <= 0) {
        await dispatch('auth/generateFingerprint')

        const fetchMeResult = await dispatch('auth/fetchMe')

        if (fetchMeResult.success) {
          commit('auth/SET_USERNAME', fetchMeResult.data.username)
        } else {
          const updateUserResult = await dispatch('auth/updateUser')

          if (updateUserResult.success) {
            commit('auth/SET_USERNAME', updateUserResult.data.username)
          }
        }
      }
    }
  }
}

export const strict = false
