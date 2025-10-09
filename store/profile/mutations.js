import { userTransformer } from '@/transformers'

export default {
  SET_PLAYER(state, player) {
    if (player) {
      state.player = userTransformer(player)
    }
  },

  CLEAR_PLAYER(state) {
    state.player = {}
  },

  SET_PLAYER_DIALOG_IS_OPEN(state, isOpen) {
    state.dialog.player.isOpen = isOpen
  }
}
