export default () => ({
  ws: null,
  userList: {
    players: [],
    totalPlayers: 0,
    totalViewers: 0
  },
  leaderboard: {
    daily: [],
    weekly: [],
    monthly: [],
    all: []
  },
  chat: {
    messages: []
  },
  dialog: {
    tourModeOnline: {
      isOpen: false
    }
  }
})
