import { GAME_TIME_LIMIT } from '@/system/constant'

export default () => ({
  room: {
    list: [],
    pagination: {},
    total: null,
    room: {}
  },
  isGameOver: false,
  alphabet: {
    activeIndex: 0,
    items: []
  },
  questions: [],
  countdown: {
    time: GAME_TIME_LIMIT
  },
  dialog: {
    stats: {
      isOpen: false
    }
  }
})
