import { roomTransformer, scoreboardTransformer } from '@/transformers'

export default {
  async postRoom({ commit, state }, { form, deviceInfo }) {
    const token = this.$auth.strategy.token.get()

    const transform = form => {
      return {
        user: this.$auth.user?.id,
        title: form.roomTitle,
        isPublic: form.isListed,
        isAnon: !this.$auth.loggedIn && !this.$auth.user ? true : form.isAnon,
        qaList: form.qaList.map(item => {
          return {
            character: item.character,
            question: item.question,
            answer: item.answer
          }
        }),
        deviceInfo
      }
    }

    const { data, error } = await this.$appFetch({
      path: 'rooms',
      method: 'POST',
      data: {
        data: transform(form)
      },
      headers: {
        Authorization: `${token}`
      }
    })

    return {
      data,
      error
    }
  },

  async editRoom({ commit, state }, { documentId, form, deviceInfo }) {
    const token = this.$auth.strategy.token.get()

    const transform = form => {
      return {
        user: this.$auth.user?.id,
        title: form.roomTitle,
        isPublic: form.isListed,
        isAnon: !this.$auth.loggedIn && !this.$auth.user ? true : form.isAnon,
        qaList: form.qaList.map(item => {
          return {
            character: item.character,
            question: item.question,
            answer: item.answer
          }
        }),
        deviceInfo
      }
    }

    const { data, error } = await this.$appFetch({
      path: `rooms/${documentId}`,
      method: 'PUT',
      data: {
        data: transform(form)
      },
      headers: {
        Authorization: `${token}`
      }
    })

    return {
      data,
      error
    }
  },

  async deleteRoom({ commit }, { documentId }) {
    const token = this.$auth.strategy.token.get()

    const { data, error } = await this.$appFetch({
      path: `rooms/${documentId}`,
      method: 'DELETE',
      headers: {
        Authorization: `${token}`
      }
    })

    return {
      data,
      error
    }
  },

  async fetchRooms({ commit, state }, params) {
    const { isLoadMore = false, page, limit, keyword, user, locale } = params

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
      user: null,
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

    // Only add user filter if user is not null
    if (user) {
      query['filters[user]'] = user
    }

    const token = this.$auth.strategy.token.get()

    const { data, error } = await this.$appFetch({
      method: 'GET',
      path: 'rooms',
      query: query,
      headers: {
        'Accept-Language': this.$i18n.locale,
        Authorization: `${token}`
      }
    })

    if (data) {
      const rooms = data.data.map(room => roomTransformer(room))

      if (isLoadMore) {
        commit('PUSH_ROOMS', rooms)
      } else {
        commit('SET_ROOMS', rooms)
      }

      const pagination = data.meta.pagination

      commit('SET_PAGINATION', pagination)

      const roomTotal = data.meta.pagination.total

      commit('SET_ROOM_TOTAL', roomTotal)
    }

    return {
      data,
      error
    }
  },

  async fetchRoom({ commit }, id) {
    const { data, error } = await this.$appFetch({
      path: `rooms/${id}`
    })

    if (data) {
      const room = roomTransformer(data.data)

      commit('SET_ROOM', room)

      commit('SET_QUESTIONS', {
        questions: room.questions
      })

      commit('SET_ALPHABET_ITEMS', room.alphabet)
    }

    return {
      data,
      error
    }
  },

  async fetchReviews({ commit }, { roomId }) {
    const { data, error } = await this.$appFetch({
      path: `room-reviews?filters[room][roomId][$eq]=${roomId}&populate=user&sort=createdAt:desc`,
      method: 'GET'
    })

    return {
      data,
      error
    }
  },

  async postReview({ commit, state }, { roomDocumentId, form }) {
    const token = this.$auth.strategy.token.get()

    const transform = form => {
      return {
        room: roomDocumentId,
        rating: form.rating,
        content: form.comment,
        user: this.$auth.user?.id
      }
    }

    const { data, error } = await this.$appFetch({
      path: `room-reviews`,
      method: 'POST',
      data: {
        data: transform(form)
      },
      headers: {
        Authorization: `${token}`
      }
    })

    return {
      data,
      error
    }
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
