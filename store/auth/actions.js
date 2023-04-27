import getBrowserFingerprint from 'get-browser-fingerprint'

const fingerprint = getBrowserFingerprint()

export default {
  async generateFingerprint({ commit, state }) {
    commit('SET_FINGERPRINT', String(fingerprint))
  },

  async fetchMe({ commit, state }) {
    const response = await fetch(`${process.env.API}/auth/me?fingerprint=${state.user.fingerprint}`, {
      method: 'get',
      headers: {
        'Accept-Language': this.$i18n.locale
      }
    })

    const result = response.json()

    return result
  },

  async updateUser({ commit, state }, username) {
    const response = await fetch(`${process.env.API}/auth/me`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': this.$i18n.locale
      },
      body: username
        ? JSON.stringify({
            fingerprint: state.user.fingerprint,
            username
          })
        : JSON.stringify({
            fingerprint: state.user.fingerprint
          })
    })

    const result = response.json()

    return result
  }
}
