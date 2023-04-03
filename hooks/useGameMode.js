import { useRoute, computed } from '@nuxtjs/composition-api'
import { gameModeKeyEnum } from '@/enums'

export default () => {
  const route = useRoute()

  const activeGameMode = computed(() => {
    if (route.value.name === 'DailyMode') {
      return gameModeKeyEnum.DAILY
    }

    if (route.value.name === 'UnlimitedMode') {
      return gameModeKeyEnum.UNLIMITED
    }

    if (route.value.name === 'CreatorModeRoom') {
      return gameModeKeyEnum.CREATOR
    }
  })

  return {
    activeGameMode
  }
}
