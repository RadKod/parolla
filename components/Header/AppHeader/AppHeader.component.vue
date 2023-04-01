<template lang="pug">
.app-header
  nav.app-header-nav
    template(
      v-if="activeGameMode === gameModeKeyEnum.DAILY || activeGameMode === gameModeKeyEnum.UNLIMITED || activeGameMode === gameModeKeyEnum.CREATOR"
    )
      li.app-header-nav__item(@click="handleClickBackButton")
        Icon(:name="require('@/assets/img/icons/svg/tabler/TablerArrowLeft.svg')")
  AppLogo(type="title")
  nav.app-header-nav
    template(
      v-if="activeGameMode === gameModeKeyEnum.DAILY || activeGameMode === gameModeKeyEnum.UNLIMITED || activeGameMode === gameModeKeyEnum.CREATOR"
    )
      li.app-header-nav__item(@click="toggleHowToPlayDialog")
        Icon(:name="require('@/assets/img/icons/svg/tabler/TablerInfoCircle.svg')")
      li.app-header-nav__item.app-header-nav__item--stats(@click="toggleStatsDialog")
        Icon(:name="require('@/assets/img/icons/svg/tabler/TablerChartBar.svg')")
    li.app-header-nav__item(@click="toggleMenuDialog")
      Icon(:name="require('@/assets/img/icons/svg/tabler/TablerMenu2.svg')")

  // How To Play Dialog
  HowToPlayDialog(cancel-button-text="Kapat" :isOpen="dialog.howToPlay.isOpen" @closed="dialog.howToPlay.isOpen = false")
  // Stats Dialog
  DailyModeStatsDialog(:isOpen="dialog.stats.mode.daily.isOpen" @closed="dialog.stats.mode.daily.isOpen = false")
  UnlimitedModeStatsDialog(:isOpen="dialog.stats.mode.unlimited.isOpen" @closed="dialog.stats.mode.unlimited.isOpen = false")
  // Menu Dialog
  MenuDialog(
    :isOpen="dialog.menu.isOpen"
    @clickedHowToCalculateStats="toggleHowToCalculateStatsDialog"
    @clickedCredits="toggleCreditsDialog"
    @clickedContact="toggleContactDialog"
    @closed="dialog.menu.isOpen = false"
  )

  // How To Calculate Stats Dialog
  HowToCalculateStatsDialog(:isOpen="dialog.howToCalculateStats.isOpen" @closed="dialog.howToCalculateStats.isOpen = false")
  // Credits Dialog
  CreditsDialog(:isOpen="dialog.credits.isOpen" @closed="dialog.credits.isOpen = false")
  // Contact Dialog
  ContactDialog(:isOpen="dialog.contact.isOpen" @closed="dialog.contact.isOpen = false")
</template>

<script>
import { defineComponent, reactive, useRouter } from '@nuxtjs/composition-api'
import { gameModeKeyEnum } from '@/enums'
import { useGameMode } from '@/hooks'
import { Icon } from 'vant'
import { AppLogo } from '@/components/Logo'
import {
  DailyModeStatsDialog,
  UnlimitedModeStatsDialog,
  HowToPlayDialog,
  MenuDialog,
  HowToCalculateStatsDialog,
  CreditsDialog,
  ContactDialog
} from '@/components/Dialog'

export default defineComponent({
  components: {
    Icon,
    AppLogo,
    DailyModeStatsDialog,
    UnlimitedModeStatsDialog,
    HowToPlayDialog,
    MenuDialog,
    HowToCalculateStatsDialog,
    CreditsDialog,
    ContactDialog
  },
  setup() {
    const router = useRouter()

    const { activeGameMode } = useGameMode()

    const dialog = reactive({
      stats: {
        mode: {
          daily: {
            isOpen: false
          },
          unlimited: {
            isOpen: false
          }
        }
      },
      howToPlay: {
        isOpen: false
      },
      menu: {
        isOpen: false
      },
      howToCalculateStats: {
        isOpen: false
      },
      credits: {
        isOpen: false
      },
      contact: {
        isOpen: false
      }
    })

    const toggleStatsDialog = () => {
      if (activeGameMode.value === gameModeKeyEnum.DAILY) {
        dialog.stats.mode.daily.isOpen = !dialog.stats.mode.daily.isOpen
      }

      if (activeGameMode.value === gameModeKeyEnum.UNLIMITED) {
        dialog.stats.mode.unlimited.isOpen = !dialog.stats.mode.unlimited.isOpen
      }
    }

    const toggleHowToPlayDialog = () => {
      dialog.howToPlay.isOpen = !dialog.howToPlay.isOpen
    }

    const toggleMenuDialog = () => {
      dialog.menu.isOpen = !dialog.menu.isOpen
    }

    const toggleHowToCalculateStatsDialog = () => {
      dialog.howToCalculateStats.isOpen = !dialog.howToCalculateStats.isOpen
    }

    const toggleCreditsDialog = () => {
      dialog.credits.isOpen = !dialog.credits.isOpen
    }

    const toggleContactDialog = () => {
      dialog.contact.isOpen = !dialog.contact.isOpen
    }

    const handleClickBackButton = () => {
      router.replace({ name: 'Home' })
    }

    return {
      gameModeKeyEnum,
      activeGameMode,
      dialog,
      toggleStatsDialog,
      toggleHowToPlayDialog,
      toggleMenuDialog,
      toggleHowToCalculateStatsDialog,
      toggleCreditsDialog,
      toggleContactDialog,
      handleClickBackButton
    }
  }
})
</script>

<style lang="scss" src="./AppHeader.component.scss"></style>
