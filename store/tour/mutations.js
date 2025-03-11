export default {
  SET_WS(state, ws) {
    state.ws = ws
  },

  SET_USER_LIST(state, userList) {
    state.userList.players = userList.players
    state.userList.totalPlayers = userList.totalCount
    state.userList.totalViewers = userList.totalViewers
  },

  SET_LEADERBOARD(state, leaderboard) {
    state.leaderboard.daily = leaderboard.daily
    state.leaderboard.weekly = leaderboard.weekly
    state.leaderboard.monthly = leaderboard.monthly
    state.leaderboard.all = leaderboard.all
  },

  SET_CHAT_MESSAGES(state, messages) {
    state.chat.messages = messages
  },

  SET_IS_OPEN_TOUR_MODE_ONLINE_DIALOG(state, isOpen) {
    state.dialog.tourModeOnline.isOpen = isOpen
  }
}
