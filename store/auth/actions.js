import { RADKOD_API_URL } from '@/system/constant'
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
