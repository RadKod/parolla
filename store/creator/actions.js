import { roomTransformer, scoreboardTransformer } from '@/transformers'

export default {
  async postQaForm({ commit, state }, { form, user, deviceInfo }) {
    const transform = form => {
      return {
        room_title: form.roomTitle,
        is_public: form.isListed,
        qa_list: form.qaList.map(item => {
          return {
            character: item.character,
            question: item.question,
            answer: item.answer
          }
        }),
        is_anon: form.isAnon,
        fingerprint: user.fingerprint,
        device_info: JSON.stringify(deviceInfo)
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

  async fetchRooms({ commit, state }, params) {
    const { isLoadMore = false, limit, cursor, keyword, locale } = params

    const getSort = _sort => {
      if (_sort === 'oldest') {
        return 'oldest'
      }

      if (_sort === 'byViewCount') {
        return 'most_played'
      }

      return 'newest'
    }

    const queryDefault = {
      per_page: 10,
      cursor: '',
      search: '',
      sort: state.room.sort,
      locale: this.$i18n.locale
    }

    const query = {
      per_page: limit || queryDefault.per_page,
      cursor: cursor || queryDefault.cursor,
      search: keyword || queryDefault.search,
      sort: getSort(state.room.sort) || queryDefault.sort,
      lang: locale || queryDefault.locale
    }

    const queryString = new URLSearchParams(query).toString()

    const response = await fetch(`${process.env.API}/rooms?${queryString}`, {
      method: 'get',
      headers: {
        'Accept-Language': this.$i18n.locale
      }
    })
    const result = await response.json()

    if (result.success) {
      const rooms = result.data.rooms.map(room => roomTransformer(room))

      if (isLoadMore) {
        commit('PUSH_ROOMS', rooms)
      } else {
        commit('SET_ROOMS', rooms)
      }

      const pagination = result.data.pagination

      commit('SET_PAGINATION', pagination)

      const roomTotal = result.data.total

      commit('SET_ROOM_TOTAL', roomTotal)
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
  },

  async postStats({ commit, state }, params) {
    const { relationId, user, stats } = params

    const transformBody = model => {
      return {
        game_result: model.stats,
        fingerprint: model.user.fingerprint
      }
    }

    const response = await fetch(`${process.env.API}/rooms/${relationId}/statistics`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': this.$i18n.locale
      },
      body: JSON.stringify(
        transformBody({
          user,
          stats
        })
      )
    })

    const result = await response.json()

    return result
  },

  async fetchScoreboard({ commit, state }, params) {
    const { relationId } = params

    const response = await fetch(`${process.env.API}/rooms/${relationId}/statistics`)
    const result = await response.json()

    if (result.success) {
      commit('SET_SCOREBOARD', scoreboardTransformer(result.data))
    }

    return result
  }
}
