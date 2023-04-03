<template lang="pug">
Dialog.dialog.creator-mode-created-room-dialog(
  v-model="state.isOpen"
  title="Oda Oluşturuldu"
  :cancel-button-text="cancelButtonText"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
  @opened="$emit('opened')"
)
  h4.creator-mode-created-room-dialog__roomTitle {{ room.title }}
  Field.creator-mode-created-room-dialog__roomIdField(:value="`https://parolla.app/room?id=${room.id}`" disabled)
    template(#left-icon)
      Icon(:name="require('@/assets/img/icons/svg/tabler/TablerLink.svg')")
    template(#button)
      Button(type="info" size="small" native-type="button" round @click="copyRoomUrl") Kopyala
</template>

<script>
import { defineComponent, reactive, watch } from '@nuxtjs/composition-api'
import { Dialog, Field, Button, Icon, Toast } from 'vant'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    Field,
    Button,
    Icon
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
      default: 'Odaya git'
    },
    room: {
      type: Object,
      required: true
    }
  },
  setup(props) {
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
      const url = `https://parolla.app/room?id=${props.room.id}`

      try {
        await navigator.clipboard.writeText(url)
        await Toast({
          message: 'Oda bağlantısı kopyalandı',
          position: 'bottom'
        })
        await navigator.share({
          title: 'parolla',
          text: url
        })
      } catch {
        await navigator.clipboard.writeText(url)
        await Toast({
          message: 'Oda bağlantısı kopyalandı',
          position: 'bottom'
        })
      }

      window.postMessage(url)
    }

    return {
      state,
      copyRoomUrl
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeCreatedRoomDialog.component.scss"></style>
