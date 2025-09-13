<template lang="pug">
Dialog.dialog.player-dialog(
  :value="isOpenPlayerDialog"
  :title="$t('dialog.player.title')"
  :cancel-button-text="cancelButtonText || $t('general.close')"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @input="handleDialogInput"
  @closed="onClosed"
  @opened="$emit('opened')"
)
  template(v-if="player && Object.keys(player).length > 0")
    .profile-view
      PlayerAvatar.profile-view__avatar(with-username :user="player")

      .profile-view-created-at
        AppIcon.profile-view-created-at__icon(name="tabler:clock" color="var(--color-text-03)" :width="16" :height="16")
        Timeago.profile-view-created-at__value(:datetime="player.createdAt" :auto-update="60" :locale="$i18n.locale")
        label.profile-view-created-at__label &nbsp;{{ $t('general.joined').toLowerCase() }}

      .tour-scores(v-if="player.tourScore && Object.keys(player.tourScore).length > 0")
        strong.tour-scores__title Tur modu skorları

        table.tour-scores-table
          thead
            tr
              th Periyot
              th Skor
              th Sıra
          tbody
            tr.tour-scores-table-item
              td.tour-scores-table-item-title Günlük
              td.tour-scores-table-item-score {{ player.tourScore.daily.score }}
              td.tour-scores-table-item-rank {{ player.tourScore.daily.rank }}

            tr.tour-scores-table-item
              td.tour-scores-table-item-title Haftalık
              td.tour-scores-table-item-score {{ player.tourScore.weekly.score }}
              td.tour-scores-table-item-rank {{ player.tourScore.weekly.rank }}

            tr.tour-scores-table-item
              td.tour-scores-table-item-title Aylık
              td.tour-scores-table-item-score {{ player.tourScore.monthly.score }}
              td.tour-scores-table-item-rank {{ player.tourScore.monthly.rank }}

            tr.tour-scores-table-item
              td.tour-scores-table-item-title Tüm zamanlar
              td.tour-scores-table-item-score {{ player.tourScore.allTime.score }}
              td.tour-scores-table-item-rank {{ player.tourScore.allTime.rank }}

  template(v-else)
    Loading(color="var(--color-brand-02)") {{ $t('dialog.player.loading') }}
</template>

<script>
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'
import { Dialog, Loading } from 'vant'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    Loading
  },
  props: {
    cancelButtonText: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props) {
    const store = useStore()

    const isOpenPlayerDialog = computed(() => store.getters['profile/isOpenPlayerDialog'])
    const player = computed(() => store.getters['profile/player'])

    const handleDialogInput = value => {
      if (!value) {
        store.commit('profile/SET_PLAYER_DIALOG_IS_OPEN', false)
      }
    }

    const onClosed = () => {
      store.commit('profile/CLEAR_PLAYER')
    }

    return {
      isOpenPlayerDialog,
      player,
      handleDialogInput,
      onClosed
    }
  }
})
</script>

<style lang="scss" src="./PlayerDialog.component.scss"></style>
