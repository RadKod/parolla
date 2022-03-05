export default {
  async fetchQuestions({ commit }) {
    const questionsResponse = await fetch(`http://localhost:3004/questions`)
    const questionsResult = await questionsResponse.json()

    commit('SET_QUESTIONS', {
      questions: questionsResult.data
    })
  }
}
