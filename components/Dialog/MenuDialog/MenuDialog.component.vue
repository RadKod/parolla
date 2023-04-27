<template lang="pug">
Dialog.dialog.menu-dialog(
  v-model="state.isOpen"
  :title="$t('dialog.menu.title')"
  :cancel-button-text="cancelButtonText || $t('general.close')"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
)
  span.menu-dialog__title {{ $t('dialog.menu.usernameEdit') }}
  UsernameEditForm.mb-base
  span.menu-dialog__title {{ $t('dialog.menu.title') }}
  CellGroup.menu-dialog-nav
    Cell.menu-dialog-nav__item(icon="eye-o" size="large" :title="$t('dialog.menu.darkTheme')")
      template(#right-icon)
        SwitchInput(v-model="isDark" size="22px" @change="toggleDarkTheme")
    Cell.menu-dialog-nav__item(
      v-if="$route.path === localePath({ name: 'Main' })"
      icon="font-o"
      size="large"
      is-link
      :title="$t('dialog.menu.switchLocale')"
      @click.native="$emit('clickedSwitchLocale')"
    )
    Cell.menu-dialog-nav__item(
      v-if="activeGameMode && activeGameMode.length > 0"
      icon="info-o"
      size="large"
      is-link
      :title="$t('dialog.menu.howToPLay')"
      @click.native="$emit('clickedHowToPlay')"
    )
    Cell.menu-dialog-nav__item(
      icon="bar-chart-o"
      size="large"
      is-link
      :title="$t('dialog.menu.howToCalculateStats')"
      @click.native="$emit('clickedHowToCalculateStats')"
    )
    Cell.menu-dialog-nav__item(
      v-if="$route.path === localePath({ name: 'CreatorMode-CreatorModeRoom' })"
      icon="smile-comment-o"
      size="large"
      is-link
      :title="$t('dialog.menu.shareRoom')"
      @click.native="openRoomSharer"
    )
    Cell.menu-dialog-nav__item(
      v-if="$route.path === localePath({ name: 'CreatorMode-CreatorModeRoom' })"
      icon="chat-o"
      size="large"
      is-link
      :title="$t('dialog.menu.reviewRoom')"
      @click.native="$emit('clickedReviewRoom')"
    )
    Cell.menu-dialog-nav__item(
      icon="smile-comment-o"
      size="large"
      is-link
      :title="$t('dialog.menu.shareApp')"
      @click.native="openAppSharer"
    )
    Cell.menu-dialog-nav__item(
      icon="manager-o"
      size="large"
      is-link
      :title="$t('dialog.menu.credits')"
      @click.native="$emit('clickedCredits')"
    )
    Cell.menu-dialog-nav__item(
      v-if="$i18n.locale === $i18n.defaultLocale"
      icon="question-o"
      size="large"
      is-link
      :title="$t('dialog.menu.suggestQa')"
      @click.native="openSuggestQuestion"
    )
    Cell.menu-dialog-nav__item(
      icon="guide-o"
      size="large"
      is-link
      :title="$t('dialog.menu.contact')"
      @click.native="$emit('clickedContact')"
    )
</template>

<script>
import { defineComponent, useRoute, useStore, useContext, ref, reactive, computed, watch } from '@nuxtjs/composition-api'
import { APP_URL } from '@/system/constant'
import { useGameMode } from '@/hooks'
import { Dialog, CellGroup, Cell, Switch, Toast } from 'vant'
import { UsernameEditForm } from '@/components/Form'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    CellGroup,
    Cell,
    SwitchInput: Switch,
    UsernameEditForm
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    cancelButtonText: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props) {
    const route = useRoute()
    const store = useStore()
    const { localePath, i18n, $colorMode } = useContext()

    const { activeGameMode } = useGameMode()

    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
      }
    )

    const isDark = ref($colorMode.value === 'dark')

    watch(
      () => $colorMode.value,
      value => {
        if (value === 'dark') {
          isDark.value = true
        } else {
          isDark.value = false
        }
      }
    )

    const toggleDarkTheme = isChecked => {
      if (isChecked) {
        $colorMode.preference = 'dark'
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#161616')
      } else {
        $colorMode.preference = 'light'
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#eeeeee')
      }
    }

    const openSuggestQuestion = () => {
      window.open(
        'https://docs.google.com/forms/d/e/1FAIpQLSec4_MAFiDOjpd9pywfocFsfJQoXfMpLT3HIaHpO0Lz3clnaA/viewform?usp=sf_link',
        '_blank'
      )
    }

    const room = computed(() => store.getters['creator/room'])
    const questions = computed(() => store.getters['creator/questions'])

    const openRoomSharer = async () => {
      const shareText = i18n.t('sharer.room.description', {
        roomTitle: room.value.title,
        questionCount: questions.value.length,
        url: `${APP_URL}${localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: route.value.query.id } })}`
      })

      try {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: i18n.t('clipboard.callback.success'),
          position: 'bottom'
        })
        await navigator.share({
          title: 'parolla',
          text: shareText
        })
      } catch {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: i18n.t('clipboard.callback.success'),
          position: 'bottom'
        })
      }
    }

    const openAppSharer = async () => {
      const shareText = i18n.t('sharer.app.description')
      window.postMessage({ type: 'sharer', data: shareText })

      try {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: i18n.t('clipboard.callback.success'),
          position: 'bottom'
        })
        await navigator.share({
          title: 'parolla',
          text: shareText
        })
      } catch {
        await navigator.clipboard.writeText(shareText)
        await Toast({
          message: i18n.t('clipboard.callback.success'),
          position: 'bottom'
        })
      }
    }

    return {
      activeGameMode,
      state,
      isDark,
      toggleDarkTheme,
      openSuggestQuestion,
      openRoomSharer,
      openAppSharer
    }
  }
})
</script>

<style lang="scss" src="./MenuDialog.component.scss"></style>
