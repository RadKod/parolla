export default {
  async fetchQuestions({ commit }) {
    const questionsResponse = await fetch(`${process.env.API}/modes/unlimited`)
    const questionsResult = await questionsResponse.json()

    commit('SET_QUESTIONS', {
      questions: questionsResult.data.questions
    })
  }
}
