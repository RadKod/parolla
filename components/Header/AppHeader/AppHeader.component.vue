<template lang="pug">
.app-header
  nav.app-header-nav
    template(v-if="isVisibleLocaleSwitchButton")
      li.app-header-nav__item(@click="toggleLocaleSwitchDialog")
        AppIcon(name="tabler:world-cog")
    template(v-if="isVisibleBackButton")
      li.app-header-nav__item(@click="handleClickBackButton")
        AppIcon(name="tabler:arrow-left")
  LazyAppLogo(type="title" @click.native.prevent.capture="handleClickAppLogo")
  nav.app-header-nav
    template(
      v-if="activeGameMode === gameModeKeyEnum.DAILY || activeGameMode === gameModeKeyEnum.UNLIMITED || activeGameMode === gameModeKeyEnum.CREATOR"
    )
      li.app-header-nav__item(
        v-if="activeGameMode === gameModeKeyEnum.DAILY || activeGameMode === gameModeKeyEnum.UNLIMITED"
        @click="toggleHowToPlayDialog"
      )
        AppIcon(name="tabler:info-circle")
      li.app-header-nav__item.app-header-nav__item--stats(@click="toggleStatsDialog")
        AppIcon(name="tabler:chart-bar")
    template(v-if="activeGameMode === gameModeKeyEnum.CREATOR")
      li.app-header-nav__item.app-header-nav__item--roomReviews(@click="toggleRoomReviewDialog")
        AppIcon.me-2(v-if="room.reviewCount > 0" name="tabler:message-2" :label="room.reviewCount")
        AppIcon(v-else name="tabler:message-2")
    li.app-header-nav__item(@click="toggleMenuDialog")
      LazyPlayerAvatar(:name="user.fingerprint")

  // How To Play Dialog
  LazyHowToPlayDialog(
    :cancel-button-text="$t('general.close')"
    :isOpen="dialog.howToPlay.isOpen"
    @closed="dialog.howToPlay.isOpen = false"
  )
  // Menu Dialog
  LazyMenuDialog(
    :isOpen="dialog.menu.isOpen"
    @clickedHowToPlay="toggleHowToPlayDialog"
    @clickedHowToCalculateStats="toggleHowToCalculateStatsDialog"
    @clickedCredits="toggleCreditsDialog"
    @clickedContact="toggleContactDialog"
    @clickedSwitchLocale="toggleLocaleSwitchDialog"
    @clickedReviewRoom="toggleRoomReviewDialog"
    @closed="dialog.menu.isOpen = false"
  )

  // How To Calculate Stats Dialog
  LazyHowToCalculateStatsDialog(:isOpen="dialog.howToCalculateStats.isOpen" @closed="dialog.howToCalculateStats.isOpen = false")
  // Credits Dialog
  LazyCreditsDialog(:isOpen="dialog.credits.isOpen" @closed="dialog.credits.isOpen = false")
  // Contact Dialog
  LazyContactDialog(:isOpen="dialog.contact.isOpen" @closed="dialog.contact.isOpen = false")
  // Locale Switch Dialog
  LazyLocaleSwitchDialog(:isOpen="dialog.localeSwitch.isOpen" @closed="dialog.localeSwitch.isOpen = false")
  // Room Review Dialog
  LazyRoomReviewDialog(:isOpen="dialog.roomReview.isOpen" @closed="dialog.roomReview.isOpen = false")
</template>

<script>
import { defineComponent, useRouter, useRoute, useContext, useStore, reactive, computed } from '@nuxtjs/composition-api'
import { gameModeKeyEnum } from '@/enums'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const { localePath } = useContext()
    const store = useStore()

    const { activeGameMode } = useGameMode()
    const { openLeaveDialog } = useDialog()

    const dialog = reactive({
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
      },
      roomReview: {
        isOpen: false
      }
    })

    const dailyDialog = computed(() => store.getters['daily/dialog'])
    const unlimitedDialog = computed(() => store.getters['unlimited/dialog'])
    const creatorDialog = computed(() => store.getters['creator/dialog'])

    const toggleStatsDialog = () => {
      if (activeGameMode.value === gameModeKeyEnum.DAILY) {
        store.commit('daily/SET_IS_OPEN_STATS_DIALOG', !dailyDialog.value.stats.isOpen)
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

    const toggleRoomReviewDialog = () => {
      dialog.roomReview.isOpen = !dialog.roomReview.isOpen
    }

    const handleClickBackButton = () => {
      const triggerRoute = () => {
        if (
          route.value.path === localePath({ name: 'CreatorMode-CreatorModeRooms' }) ||
          route.value.path === localePath({ name: 'CreatorMode-CreatorModeMyRooms' }) ||
          route.value.path === localePath({ name: 'CreatorMode-CreatorModeCompose' }) ||
          route.value.path === localePath({ name: 'CreatorMode-CreatorModeRoom' })
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
        route.value.path === localePath({ name: 'CreatorMode-CreatorModeMyRooms' }) ||
        route.value.path === localePath({ name: 'CreatorMode-CreatorModeCompose' })
      ) {
        return true
      }
    })

    const user = computed(() => store.getters['auth/user'])
    const room = computed(() => store.getters['creator/room'])

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
      toggleRoomReviewDialog,
      handleClickBackButton,
      handleClickAppLogo,
      isVisibleLocaleSwitchButton,
      isVisibleBackButton,
      user,
      room
    }
  }
})
</script>

<style lang="scss" src="./AppHeader.component.scss"></style>
