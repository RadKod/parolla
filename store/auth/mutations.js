import { userTransformer } from '@/transformers'

export default {
  SET_FINGERPRINT(state, fingerprint) {
    state.user.fingerprint = userTransformer({ fingerprint }).fingerprint
  },

  SET_USERNAME(state, username) {
    state.user.username = userTransformer({ username }).username
  },

  SET_USER(state, user) {
    this.$auth.setUser(user)

    state.user = userTransformer(user)
  },

  LOGOUT(state) {
    this.$auth.logout()
  }
}
