export default {
  rooms(state) {
    return state.rooms
  },

  room(state) {
    return state.room
  },

  isGameOver(state) {
    return state.isGameOver
  },

  alphabet(state) {
    return state.alphabet
  },

  questions(state) {
    return state.questions
  },

  countdown(state) {
    return state.countdown
  },

  correctAnswers(state) {
    return state.alphabet.items.filter(item => item.isCorrect)
  },

  wrongAnswers(state) {
    return state.alphabet.items.filter(item => item.isWrong)
  },

  passedAnswers(state) {
    return state.alphabet.items.filter(item => item.isPassed)
  },

  dialog(state) {
    return state.dialog
  }
}
