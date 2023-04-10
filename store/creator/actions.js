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
        'Content-Type': 'application/json',
        'Accept-Language': this.$i18n.locale
      },
      body: JSON.stringify(transform(form))
    })

    return response.json()
  },

  async fetchRooms({ commit }) {
    const response = await fetch(`${process.env.API}/rooms`, {
      method: 'get',
      headers: {
        'Accept-Language': this.$i18n.locale
      }
    })
    const result = await response.json()

    if (result.success) {
      const rooms = result.data.rooms.map(room => roomTransformer(room))

      commit('SET_ROOMS', rooms)
    }

    return result
  },

  async fetchRoom({ commit }, id) {
    const response = await fetch(`${process.env.API}/modes/custom?room=${id}`)
    const result = await response.json()

    if (result.success) {
      const room = roomTransformer(result.data)

      commit('SET_ROOM', {
        title: room.title,
        isPublic: room.isPublic
      })

      commit('SET_QUESTIONS', {
        questions: room.questions
      })

      commit('SET_ALPHABET_ITEMS', room.alphabet)
    }

    return result
  }
}
