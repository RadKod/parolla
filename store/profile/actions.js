export default {
  async fetchPlayer({ commit }, { id }) {
    const { data, error } = await this.$appFetch({
      path: `users/${id}`
    })

    return {
      data,
      error
    }
  }
}
