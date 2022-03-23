export default {
  async fetchQuestions({ commit }) {
    const questionsResponse = await fetch(`http://192.168.1.35:3004/questions`)
    const questionsResult = await questionsResponse.json()

    commit('SET_QUESTIONS', {
      questions: questionsResult.data
    })
  }
}
