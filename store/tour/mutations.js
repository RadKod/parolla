export default {
  SET_TOUR(state, tour) {
    state.tour = {
      ...state.tour,
      ...tour
    }
  },

  SET_USER_LIST(state, userList) {
    const mappedPlayers = userList.players.map(player => ({
      id: player.id,
      username: player.name,
      avatarUrl: player.avatarUrl,
      lives: player.lives
    }))

    state.userList.players = mappedPlayers
    state.userList.totalPlayers = userList.totalCount
    state.userList.totalViewers = userList.totalViewers
  },

  SET_LEADERBOARD(state, leaderboard) {
    const mappedLeaderboard = leaderboard => {
      return leaderboard?.map(player => ({
        id: player.user_id,
        username: player.username,
        score: player.score
      }))
    }

    state.leaderboard.daily = mappedLeaderboard(leaderboard.daily)
    state.leaderboard.weekly = mappedLeaderboard(leaderboard.weekly)
    state.leaderboard.monthly = mappedLeaderboard(leaderboard.monthly)
    state.leaderboard.allTime = mappedLeaderboard(leaderboard['all_time'])
  },

  SET_CHAT_MESSAGES(state, messages) {
    state.chat.messages = messages
  },

  SET_IS_OPEN_TOUR_MODE_ONLINE_DIALOG(state, isOpen) {
    state.dialog.tourModeOnline.isOpen = isOpen
  }
}
