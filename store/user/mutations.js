import { userTransformer } from '@/transformers'

export default {
  SET_USER(state, user) {
    state.user = userTransformer(user)
  },

  CLEAR_USER(state) {
    state.user = {}
  },

  SET_PLAYER_DIALOG_IS_OPEN(state, isOpen) {
    state.dialog.player.isOpen = isOpen
  }
}
