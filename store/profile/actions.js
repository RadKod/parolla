export default {
  async fetchPlayer({ commit }, { username }) {
    const { data, error } = await this.$appFetch({
      path: `users?filters[username][$eq]=${username}`
    })

    return {
      data,
      error
    }
  }
}
