import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key: 'persistStore',
    reducer: state => ({
      auth: {
        user: {
          fingerprint: state.auth.user.fingerprint,
          username: state.auth.user.username
        }
      },
      app: {
        soundFx: state.app.soundFx
      },
      daily: {
        isGameOver: state.daily.isGameOver,
        currentDate: state.daily.currentDate,
        questions: state.daily.questions
      }
    })
  }).plugin(store)
}
