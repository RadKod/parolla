import { useContext } from '@nuxtjs/composition-api'

export default () => {
  const context = useContext()

  /**
   * Check if the current authenticated user is the owner
   * @param {Object} params - The parameters object
   * @param {UserTypes} [params.user] - A single user to check ownership against
   * @param {UserTypes[]} [params.users] - An array of users to check ownership against
   * @returns {boolean} True if the current user is the owner, false otherwise
   */
  const isOwner = ({ user, users }) => {
    if (user) {
      return user.id === context.$auth.user?.id
    }

    if (users) {
      return users.some(u => u.id === context.$auth.user?.id)
    }

    return false
  }

  return {
    isOwner
  }
}
