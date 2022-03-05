export default {
  SET_HAS_STARTED(state, { hasStarted }) {
    state.hasStarted = hasStarted
  },
  SET_IS_GAME_OVER(state, { isGameOver }) {
    state.isGameOver = isGameOver
  },
  SET_QUESTIONS(state, { questions }) {
    state.questions = questions
  }
}
