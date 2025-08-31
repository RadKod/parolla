export default {
  player(state) {
    return state.player
  },
  isOpenPlayerDialog(state) {
    return state.dialog.player.isOpen
  }
}
