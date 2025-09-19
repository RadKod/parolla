import { Notify } from 'vant'

export default ({ $auth, app, store, redirect }) => {
  if (!$auth.loggedIn && !$auth.user) {
    Notify({
      message: app.i18n.t('error.loginRequired'),
      type: 'warning',
      duration: 3000
    })

    redirect(app.localePath({ name: 'Main' }))

    setTimeout(() => {
      store.commit('auth/SET_AUTH_DIALOG_IS_OPEN', true)
    }, 1000)
  }
}
