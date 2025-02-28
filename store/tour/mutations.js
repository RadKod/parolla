export default {
  SET_WS(state, ws) {
    state.ws = ws
  },
  SET_CHAT_MESSAGES(state, messages) {
    state.chat.messages = messages
  },
  SET_IS_OPEN_TOUR_MODE_ONLINE_DIALOG(state, isOpen) {
    state.dialog.tourModeOnline.isOpen = isOpen
  }
}
