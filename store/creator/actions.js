import { roomTransformer, scoreboardTransformer } from '@/transformers'

export default {
  async postQaForm({ commit, state }, { form, user, deviceInfo }) {
    const transform = form => {
      return {
        title: form.roomTitle,
        isPublic: form.isListed,
        qaList: form.qaList.map(item => {
          return {
            character: item.character,
            question: item.question,
            answer: item.answer
          }
        }),
        isAnon: form.isAnon
      }
    }

    const response = await fetch(`${process.env.API_STRAPI}/rooms`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': this.$i18n.locale
      },
      body: JSON.stringify({
        data: transform(form)
      })
    })

    const result = await response.json()

    return result
  },

  async fetchRooms({ commit, state }, params) {
    const { isLoadMore = false, limit, keyword, locale, page } = params

    const getSort = _sort => {
      if (_sort === 'oldest') {
        return 'createdAt:asc'
      }

      if (_sort === 'byViewCount') {
        return 'viewCount:desc'
      }

      return 'createdAt:desc'
    }

    const queryDefault = {
      page: 1,
      per_page: 10,
      search: '',
      sort: state.room.sort,
      locale: this.$i18n.locale,
      populate: '*'
    }

    const query = {
      'pagination[page]': page || queryDefault.page,
      'pagination[pageSize]': limit || queryDefault.per_page,
      'filters[title][$containsi]': keyword || queryDefault.search,
      sort: getSort(state.room.sort) || queryDefault.sort,
      lang: locale || queryDefault.locale,
      populate: 'user'
    }

    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const response = await fetch(`${process.env.API_STRAPI}/rooms?${queryString}`, {
      method: 'GET',
      headers: {
        'Accept-Language': this.$i18n.locale
      }
    })
    const result = await response.json()

    if (result?.data) {
      const rooms = result.data.map(room => roomTransformer(room))

      if (isLoadMore) {
        commit('PUSH_ROOMS', rooms)
      } else {
        commit('SET_ROOMS', rooms)
      }

      const pagination = result.meta.pagination

      commit('SET_PAGINATION', pagination)

      const roomTotal = result.meta.pagination.total

      commit('SET_ROOM_TOTAL', roomTotal)
    }

    return result
  },

  async fetchRoom({ commit }, id) {
    const response = await fetch(`${process.env.API_STRAPI}/rooms/${id}`)
    const result = await response.json()

    if (result?.data) {
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
    const { isLoadMore = false, limit, cursor, relationId } = params

    const queryDefault = {
      per_page: 100,
      cursor: ''
    }

    const query = {
      per_page: limit || queryDefault.per_page,
      cursor: state.scoreboard.pagination.cursor
    }

    const queryString = new URLSearchParams(query).toString()

    const response = await fetch(`${process.env.API}/rooms/${relationId}/statistics?${queryString}`)
    const result = await response.json()

    if (result.success) {
      if (isLoadMore) {
        commit('PUSH_SCOREBOARD', scoreboardTransformer(result.data.statistics))
      } else {
        commit('SET_SCOREBOARD', scoreboardTransformer(result.data.statistics))
      }

      commit('SET_SCOREBOARD_PAGINATION', {
        pagination: result.data.pagination,
        total: result.data.total
      })
    }

    return result
  }
}
