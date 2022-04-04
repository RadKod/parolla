<template lang="pug">
.app-header
  AppLogo(:letter-size="16" :width="34" :height="34")
  AppLogo(type="title")
  nav.app-header-nav
    li.app-header-nav__item.cursor-pointer(@click="toggleStatsDialog")
      Icon(name="todo-list")
    li.app-header-nav__item.cursor-pointer(@click="toggleHowToPlayDialog")
      Icon(name="info")

  // How To Play Dialog
  HowToPlayDialog(cancel-button-text="Kapat" :isOpen="dialog.howToPlay.isOpen" @closed="dialog.howToPlay.isOpen = false")
  // Stats Dialog
  StatsDialog(:isOpen="dialog.stats.isOpen" @closed="dialog.stats.isOpen = false")
</template>

<script>
import { defineComponent, reactive } from '@nuxtjs/composition-api'
import { Icon } from 'vant'
import { AppLogo } from '@/components/Logo'
import { StatsDialog, HowToPlayDialog } from '@/components/Dialog'

export default defineComponent({
  components: {
    Icon,
    AppLogo,
    StatsDialog,
    HowToPlayDialog
  },
  setup() {
    const dialog = reactive({
      stats: {
        isOpen: false
      },
      howToPlay: {
        isOpen: false
      }
    })

    const toggleStatsDialog = () => {
      dialog.stats.isOpen = !dialog.stats.isOpen
    }

    const toggleHowToPlayDialog = () => {
      dialog.howToPlay.isOpen = !dialog.howToPlay.isOpen
    }

    return { dialog, toggleStatsDialog, toggleHowToPlayDialog }
  }
})
</script>

<style lang="scss" src="./AppHeader.component.scss"></style>
