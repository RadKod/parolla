export default {
  async fetchQuestions({ commit }) {
    const questionsResponse = await fetch(`${process.env.API}/questions`)
    const questionsResult = await questionsResponse.json()

    commit('SET_QUESTIONS', {
      questions: questionsResult.data.questions
    })
  }
}
