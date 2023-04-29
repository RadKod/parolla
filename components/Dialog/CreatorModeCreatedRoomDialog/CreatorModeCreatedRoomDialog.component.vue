<template lang="pug">
Dialog.dialog.creator-mode-created-room-dialog(
  v-model="state.isOpen"
  :title="$t('dialog.createdRoom.title')"
  :cancel-button-text="cancelButtonText || $t('general.close')"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
  @opened="$emit('opened')"
)
  h4.creator-mode-created-room-dialog__roomTitle {{ room.title }}
  Field.creator-mode-created-room-dialog__roomIdField(
    :value="`${APP_URL}${localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: room.id } })}`"
    disabled
  )
    template(#left-icon)
      AppIcon(name="tabler:link" color="var(--color-icon-01)")
    template(#button)
      Button(type="info" size="small" native-type="button" round @click="copyRoomUrl") {{ $t('clipboard.copy') }}
</template>

<script>
import { defineComponent, useContext, reactive, watch } from '@nuxtjs/composition-api'
import { APP_URL } from '@/system/constant'
import { Dialog, Field, Button, Toast } from 'vant'
import { AppIcon } from '@/components/Icon'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    Field,
    Button,
    AppIcon
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
    },
    room: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { localePath, i18n } = useContext()

    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
      }
    )

    const copyRoomUrl = async () => {
      const url = `${APP_URL}${localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: props.room.id } })}`
      window.postMessage({ type: 'sharer', data: url })

      try {
        await navigator.clipboard.writeText(url)
        await Toast({
          message: i18n.t('dialog.createdRoom.copyUrl.callback.success'),
          position: 'bottom'
        })
        await navigator.share({
          title: 'parolla',
          text: url
        })
      } catch {
        await navigator.clipboard.writeText(url)
        await Toast({
          message: i18n.t('dialog.createdRoom.copyUrl.callback.success'),
          position: 'bottom'
        })
      }
    }

    return {
      APP_URL,
      state,
      copyRoomUrl
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeCreatedRoomDialog.component.scss"></style>
