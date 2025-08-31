import { userTransformer } from '@/transformers'

export default {
  SET_USER(state, user) {
    this.$auth.setUser(user)

    state.user = userTransformer(user)
  },

  LOGOUT(state) {
    this.$auth.logout()
  },

  SET_AUTH_DIALOG_IS_OPEN(state, isOpen) {
    state.dialog.auth.isOpen = isOpen
  }
}
