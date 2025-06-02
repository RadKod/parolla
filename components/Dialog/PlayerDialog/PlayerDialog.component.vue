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
  template(v-if="user && Object.keys(user).length > 0")
    .profile-view
      PlayerAvatar.profile-view__avatar(with-username :user="user")

      .profile-view-created-at
        AppIcon.profile-view-created-at__icon(name="tabler:clock" color="var(--color-text-03)" :width="16" :height="16")
        Timeago.profile-view-created-at__value(:datetime="user.createdAt" :auto-update="60" :locale="$i18n.locale")
        label.profile-view-created-at__label &nbsp;{{ $t('general.joined').toLowerCase() }}

      .tour-scores(v-if="user.tourScores && Object.keys(user.tourScores).length > 0")
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
              td.tour-scores-table-item-score {{ user.tourScores.daily.score }}
              td.tour-scores-table-item-rank {{ user.tourScores.daily.rank }}

            tr.tour-scores-table-item
              td.tour-scores-table-item-title Haftalık
              td.tour-scores-table-item-score {{ user.tourScores.weekly.score }}
              td.tour-scores-table-item-rank {{ user.tourScores.weekly.rank }}

            tr.tour-scores-table-item
              td.tour-scores-table-item-title Aylık
              td.tour-scores-table-item-score {{ user.tourScores.monthly.score }}
              td.tour-scores-table-item-rank {{ user.tourScores.monthly.rank }}

            tr.tour-scores-table-item
              td.tour-scores-table-item-title Tüm zamanlar
              td.tour-scores-table-item-score {{ user.tourScores.allTime.score }}
              td.tour-scores-table-item-rank {{ user.tourScores.allTime.rank }}

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

    const isOpenPlayerDialog = computed(() => store.getters['user/isOpenPlayerDialog'])
    const user = computed(() => store.getters['user/user'])

    const handleDialogInput = value => {
      if (!value) {
        store.commit('user/SET_PLAYER_DIALOG_IS_OPEN', false)
      }
    }

    const onClosed = () => {
      store.commit('user/CLEAR_USER')
    }

    return {
      isOpenPlayerDialog,
      user,
      handleDialogInput,
      onClosed
    }
  }
})
</script>

<style lang="scss" src="./PlayerDialog.component.scss"></style>
