export const actions = {
  async nuxtClientInit({ dispatch, commit }) {
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
    }
  }
}

export const strict = false
