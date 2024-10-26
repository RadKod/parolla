import { useStore } from '@nuxtjs/composition-api'

export default () => {
  const store = useStore()

  const getDeviceInfo = async () => {
    const { data } = await store.dispatch('auth/getDeviceInfo')

    return data
  }

  return {
    getDeviceInfo
  }
}
