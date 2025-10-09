import { RADKOD_API_URL } from '@/system/constant'

export default {
  async fetchMe({ commit, state }) {
    const token = this.$auth.strategy.token.get()

    const { data, error } = await this.$appFetch({
      path: 'users/me',
      headers: {
        Authorization: `${token}`
      }
    })

    if (data) {
      commit('SET_USER', data)
    }

    return {
      data,
      error
    }
  },

  async fetchGoogleUser({ commit, state }, callbackParams) {
    const { data, error } = await this.$appFetch({
      path: `auth/google/callback?${callbackParams}`,
      headers: {
        Authorization: `${callbackParams}`
      }
    })

    return {
      data,
      error
    }
  },

  /**
   * Set Google user
   * @param {SetGoogleUserTypes} params
   */
  async setGoogleUser({ commit, state }, params) {
    const { googleResponse } = params

    await this.$auth.setStrategy('google')
    await this.$auth.setUserToken(googleResponse.jwt)
    await this.$auth.setUser(googleResponse.user)

    await commit('SET_USER', googleResponse.user)
  },

  async updateUser({ commit, state }, params) {
    const { username } = params

    const token = this.$auth.strategy.token.get()

    const { data, error } = await this.$appFetch({
      path: 'users/me',
      headers: {
        Authorization: `${token}`
      },
      method: 'PUT',
      data: {
        username
      }
    })

    return {
      data,
      error
    }
  },

  async logout({ commit, state }) {
    commit('LOGOUT')
  },

  async getDeviceInfo() {
    const UAParser = require('ua-parser-js')
    const parser = new UAParser(navigator.userAgent)
    const ua = parser.getResult()

    let deviceInfo = {
      ...ua
    }

    if (typeof window !== 'undefined') {
      deviceInfo = {
        ...deviceInfo,
        window: {
          outerWidth: window.outerWidth,
          outerHeight: window.outerHeight
        }
      }
    }

    if (navigator) {
      deviceInfo = {
        ...deviceInfo,
        language: navigator.language
      }
    }

    try {
      const response = await fetch(`${RADKOD_API_URL}/global/ipinfo.php`)
      const ipData = await response.json()

      if (ipData) {
        deviceInfo = {
          ...deviceInfo,
          ipData
        }
      }
    } catch (error) {
      console.error('Error fetching IPData info:', error)
    }

    return {
      data: deviceInfo
    }
  }
}
