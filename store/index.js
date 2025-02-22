export const actions = {
  async nuxtClientInit({ dispatch, commit }) {
    if (process.browser) {
      await dispatch('auth/generateFingerprint')

      const fetchMeResult = await dispatch('auth/fetchMe')

      commit('auth/SET_USER', fetchMeResult.data)

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

export const strict = false
