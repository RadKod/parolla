export default {
  async fetchQuestions({ commit }) {
    const questionsResponse = await fetch(`${process.env.API_STRAPI}/modes/daily`)
    const questionsResult = await questionsResponse.json()

    commit('SET_QUESTIONS', {
      questions: questionsResult
    })
  }
}
