import { RADKOD_API_URL } from '@/system/constant'
import getBrowserFingerprint from 'get-browser-fingerprint'

const fingerprint = getBrowserFingerprint()

export default {
  async generateFingerprint({ commit, state }) {
    commit('SET_FINGERPRINT', String(fingerprint))
  },

  async fetchMe({ commit, state }) {
    const headers = {
      'Accept-Language': this.$i18n.locale
    }

    const token = this.$auth.strategy.token.get()

    if (token) {
      headers.Authorization = token
    }

    const response = await fetch(`${process.env.API}/auth/me?fingerprint=${state.user.fingerprint}`, {
      method: 'get',
      headers
    })

    const result = response.json()

    return result
  },

  async googleRegister({ commit, state }, params) {
    const { code, state: stateParam, fingerprint } = params

    const response = await fetch(`${process.env.API}/auth/google/callback`, {
      method: 'post',
      headers: {
        'Accept-Language': this.$i18n.locale,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        state: stateParam,
        fingerprint
      })
    })

    const result = response.json()

    return result
  },

  async updateUser({ commit, state }, username) {
    const headers = {
      'Accept-Language': this.$i18n.locale,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    const token = this.$auth.strategy.token.get()

    if (token) {
      headers.Authorization = token
    }

    const response = await fetch(`${process.env.API}/auth/me`, {
      method: 'put',
      headers: headers,
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
