import { ref } from '@nuxtjs/composition-api'

export default () => {
  const isMobileDevice = ref(false)

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobileDevice.value = true
  }

  return { isMobileDevice }
}
