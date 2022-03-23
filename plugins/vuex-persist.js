import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    reducer: state => ({
      game: {
        isGameOver: state.game.isGameOver,
        questions: state.game.questions,
        currentDate: state.game.currentDate
        // alphabet: state.game.alphabet,
        // countdown: state.game.countdown
      }
    })
  }).plugin(store)
}
