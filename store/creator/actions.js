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
    const result = await response.json()

    return result
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

      commit('SET_ROOM', room)

      commit('SET_QUESTIONS', {
        questions: room.questions
      })

      commit('SET_ALPHABET_ITEMS', room.alphabet)
    }

    return result
  },

  async fetchReviews({ commit }, { relationId }) {
    const response = await fetch(`${process.env.API}/rooms/${relationId}/reviews`)
    const result = await response.json()

    return result
  },

  async postReview({ commit, state }, { relationId, form, user }) {
    const transform = form => {
      return {
        rating: form.rating,
        content: form.comment,
        fingerprint: user.fingerprint
      }
    }

    const response = await fetch(`${process.env.API}/rooms/${relationId}/reviews`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': this.$i18n.locale
      },
      body: JSON.stringify(transform(form))
    })
    const result = await response.json()

    return result
  }
}
