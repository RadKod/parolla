export default () => ({
  tour: {
    question: null,
    countdown: {
      percentage: 0,
      seconds: 30
    },
    maxLives: 3,
    waitingNextSeconds: 10,
    isTimeUp: false,
    isPlayerFinishedTheTour: false,
    recentAnswers: [],
    roundScores: [],
    popover: {
      maxLives: {
        isOpen: false
      }
    }
  },
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
