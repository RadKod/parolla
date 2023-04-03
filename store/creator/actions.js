import { roomTransformer } from '@/transformers'

export default {
  async postQaForm({ commit, state }, form) {
    const transform = form => {
      return {
        room_title: form.roomTitle,
        is_public: form.isPublic,
        qa_list: form.qaList.map(item => {
          return {
            character: item.character,
            question: item.question,
            answer: item.answer
          }
        })
      }
    }

    const response = await fetch(`${process.env.API}/modes/custom`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transform(form))
    })

    return response.json()
  },

  async fetchRooms({ commit }) {
    const response = await fetch(`${process.env.API}/rooms`)
    const result = await response.json()

    const rooms = result.data.rooms.map(room => roomTransformer(room))

    commit('SET_ROOMS', rooms)
  },

  async fetchQuestions({ commit }) {
    const questionsResponse = await fetch(`${process.env.API}/modes/custom?room=${roomId}`)
    const questionsResult = await questionsResponse.json()

    commit('SET_QUESTIONS', {
      questions: questionsResult.data.questions
    })
  }
}
