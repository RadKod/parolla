export default {
  user(state) {
    return state.user
  },
  isOpenAuthDialog(state) {
    return state.dialog.auth.isOpen
  }
}
