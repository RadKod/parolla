export default {
  async fetchQuestions({ commit, roomId }) {
    const questionsResponse = await fetch(`${process.env.API}/modes/custom?room=${roomId}`)
    const questionsResult = await questionsResponse.json()

    commit('SET_QUESTIONS', {
      questions: questionsResult.data.questions
    })
  }
}
