<template lang="pug">
.app-header
  nav.app-header-nav
    template(v-if="isVisibleLocaleSwitchButton")
      li.app-header-nav__item(@click="toggleLocaleSwitchDialog")
        Icon(:name="require('@/assets/img/icons/svg/tabler/TablerWorldCog.svg')")
    template(v-if="isVisibleBackButton")
      li.app-header-nav__item(@click="handleClickBackButton")
        Icon(:name="require('@/assets/img/icons/svg/tabler/TablerArrowLeft.svg')")
  AppLogo(type="title" @click.native.prevent.capture="handleClickAppLogo")
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

  client-only
    // How To Play Dialog
    HowToPlayDialog(:cancel-button-text="$t('general.close')" :isOpen="dialog.howToPlay.isOpen" @closed="dialog.howToPlay.isOpen = false")
    // Stats Dialog
    DailyModeStatsDialog(:isOpen="dialog.stats.mode.daily.isOpen" @closed="dialog.stats.mode.daily.isOpen = false")
    // Menu Dialog
    MenuDialog(
      :isOpen="dialog.menu.isOpen"
      @clickedHowToCalculateStats="toggleHowToCalculateStatsDialog"
      @clickedCredits="toggleCreditsDialog"
      @clickedContact="toggleContactDialog"
      @clickedSwitchLocale="toggleLocaleSwitchDialog"
      @closed="dialog.menu.isOpen = false"
    )

    // How To Calculate Stats Dialog
    HowToCalculateStatsDialog(:isOpen="dialog.howToCalculateStats.isOpen" @closed="dialog.howToCalculateStats.isOpen = false")
    // Credits Dialog
    CreditsDialog(:isOpen="dialog.credits.isOpen" @closed="dialog.credits.isOpen = false")
    // Contact Dialog
    ContactDialog(:isOpen="dialog.contact.isOpen" @closed="dialog.contact.isOpen = false")
    // Locale Switch Dialog
    LocaleSwitchDialog(:isOpen="dialog.localeSwitch.isOpen" @closed="dialog.localeSwitch.isOpen = false")
</template>

<script>
import { defineComponent, useRouter, useRoute, useContext, useStore, reactive, computed } from '@nuxtjs/composition-api'
import { gameModeKeyEnum } from '@/enums'
import { useGameMode, useDialog } from '@/hooks'
import { Icon } from 'vant'
import { AppLogo } from '@/components/Logo'
import {
  DailyModeStatsDialog,
  HowToPlayDialog,
  MenuDialog,
  HowToCalculateStatsDialog,
  CreditsDialog,
  ContactDialog,
  LocaleSwitchDialog
} from '@/components/Dialog'

export default defineComponent({
  components: {
    Icon,
    AppLogo,
    DailyModeStatsDialog,
    HowToPlayDialog,
    MenuDialog,
    HowToCalculateStatsDialog,
    CreditsDialog,
    ContactDialog,
    LocaleSwitchDialog
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { localePath } = useContext()
    const store = useStore()

    const { activeGameMode } = useGameMode()
    const { openLeaveDialog } = useDialog()

    const dialog = reactive({
      stats: {
        mode: {
          daily: {
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
      },
      localeSwitch: {
        isOpen: false
      }
    })

    const unlimitedDialog = computed(() => store.getters['unlimited/dialog'])
    const creatorDialog = computed(() => store.getters['unlimited/dialog'])

    const toggleStatsDialog = () => {
      if (activeGameMode.value === gameModeKeyEnum.DAILY) {
        dialog.stats.mode.daily.isOpen = !dialog.stats.mode.daily.isOpen
      }

      if (activeGameMode.value === gameModeKeyEnum.UNLIMITED) {
        store.commit('unlimited/SET_IS_OPEN_STATS_DIALOG', !unlimitedDialog.value.stats.isOpen)
      }

      if (activeGameMode.value === gameModeKeyEnum.CREATOR) {
        store.commit('creator/SET_IS_OPEN_STATS_DIALOG', !creatorDialog.value.stats.isOpen)
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

    const toggleLocaleSwitchDialog = () => {
      dialog.localeSwitch.isOpen = !dialog.localeSwitch.isOpen
    }

    const handleClickBackButton = () => {
      const triggerRoute = () => {
        if (
          route.value.path === localePath({ name: 'CreatorMode-CreatorModeRooms' }) ||
          route.value.path === localePath({ name: 'CreatorMode-CreatorModeCompose' })
        ) {
          router.replace(localePath({ name: 'CreatorMode-CreatorModeIntro' }))
        } else {
          router.replace(localePath({ name: 'Main' }))
        }
      }

      if (activeGameMode.value && activeGameMode.value.length > 0) {
        openLeaveDialog({
          confirm: () => {
            triggerRoute()
          }
        })
      } else {
        triggerRoute()
      }
    }

    const handleClickAppLogo = () => {
      if (activeGameMode.value && activeGameMode.value.length > 0) {
        openLeaveDialog({
          confirm: () => {
            router.push(localePath({ name: 'Main' }))
          }
        })
      } else {
        router.push(localePath({ name: 'Main' }))
      }
    }

    const isVisibleLocaleSwitchButton = computed(() => {
      if (route.value.path === localePath({ name: 'Main' })) {
        return true
      }
    })

    const isVisibleBackButton = computed(() => {
      if (
        activeGameMode.value === gameModeKeyEnum.DAILY ||
        activeGameMode.value === gameModeKeyEnum.UNLIMITED ||
        activeGameMode.value === gameModeKeyEnum.CREATOR ||
        route.value.path === localePath({ name: 'CreatorMode-CreatorModeIntro' }) ||
        route.value.path === localePath({ name: 'CreatorMode-CreatorModeRooms' }) ||
        route.value.path === localePath({ name: 'CreatorMode-CreatorModeCompose' })
      ) {
        return true
      }
    })

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
      toggleLocaleSwitchDialog,
      handleClickBackButton,
      handleClickAppLogo,
      isVisibleLocaleSwitchButton,
      isVisibleBackButton
    }
  }
})
</script>

<style lang="scss" src="./AppHeader.component.scss"></style>
