export default {
  async fetchQuestions({ commit }) {
    const { data, error } = await this.$appFetch({
      path: `modes/unlimited`
    })

    if (data) {
      commit('SET_QUESTIONS', {
        questions: data
      })
    }

    return {
      data,
      error
    }
  }
}
