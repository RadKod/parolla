export default {
  async fetchUser({ commit, state }, { fingerprint, id }) {
    const headers = {
      'Accept-Language': this.$i18n.locale
    }

    const getUrl = () => {
      if (fingerprint) {
        return `${process.env.API}/user?fingerprint=${fingerprint}`
      }

      return `${process.env.API}/user?id=${id}`
    }

    const response = await fetch(getUrl(), {
      method: 'get',
      headers
    })

    const result = await response.json()

    return result
  }
}
