export default ({ app, store }) => {
  const clickHandler = event => {
    const targetElement = event.target
    const target = targetElement ? targetElement.closest('[auth-control]') : null

    if (target) {
      if (!app.$auth.loggedIn) {
        store.commit('auth/SET_AUTH_DIALOG_IS_OPEN', true)

        event.preventDefault()
        event.stopPropagation()

        return false
      }
    }
  }

  const addClickListener = () => {
    window.removeEventListener('click', clickHandler, true)
    window.addEventListener('click', clickHandler, true)
  }

  if (process.client) {
    addClickListener()

    app.router?.afterEach(() => {
      addClickListener()
      store.commit('auth/SET_AUTH_DIALOG_IS_OPEN', false)
    })
  }
}
