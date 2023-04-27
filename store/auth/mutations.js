import { userTransformer } from '@/transformers'

export default {
  SET_FINGERPRINT(state, fingerprint) {
    state.user.fingerprint = userTransformer({ fingerprint }).fingerprint
  },

  SET_USERNAME(state, username) {
    state.user.username = userTransformer({ username }).username
  }
}
