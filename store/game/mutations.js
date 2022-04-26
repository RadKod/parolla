export default {
  SET_IS_GAME_OVER(state, { isGameOver }) {
    state.isGameOver = isGameOver
  },
  SET_QUESTIONS(state, { questions }) {
    state.questions = questions
  },
  SET_ALPHABET_ACTIVE_INDEX(state, index) {
    state.alphabet.activeIndex = index
  },
  UPDATE_COUNTDOWN_TIMER(state, ms) {
    state.countdown.time = ms
  }
}
