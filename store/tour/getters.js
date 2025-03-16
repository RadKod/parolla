export default {
  tour(state) {
    return state.tour
  },

  userList(state) {
    return state.userList
  },

  leaderboard(state) {
    return state.leaderboard
  },

  todaysBestScorer(state) {
    return state.leaderboard?.daily?.[0]
  },

  chatMessages(state) {
    return state.chat.messages
  },

  dialog(state) {
    return state.dialog
  }
}
