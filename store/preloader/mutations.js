export default {
  HIDE_PRELOADER(state) {
    state.isLoading = !state.isLoading
    state.isAttached = true
    document.querySelector('html').style.overflowY = 'auto'
    document.querySelector('html').style.overflowX = 'hidden'
  }
}
