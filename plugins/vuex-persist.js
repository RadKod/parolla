import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key: 'persistStore',
    reducer: state => ({
      game: {
        isGameOver: state.game.isGameOver,
        currentDate: state.game.currentDate,
        questions: state.game.questions
      }
    })
  }).plugin(store)
}
