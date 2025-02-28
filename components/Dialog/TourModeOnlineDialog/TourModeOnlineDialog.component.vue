<template lang="pug">
Dialog.dialog.stats-dialog.tour-mode-online-dialog(
  v-model="state.isOpen"
  :title="$t('dialog.tourModeOnline.title')"
  :cancel-button-text="cancelButtonText || $t('general.close')"
  :confirm-button-text="confirmButtonText || $t('general.apply')"
  :show-cancel-button="true"
  :show-confirm-button="false"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
  @cancel="$emit('onCancel')"
  @confirm="$emit('onConfirm')"
)
  // Tabs
  Tabs.stats-dialog__tabs(v-model="activeTab")
    // Chat Tab
    Tab(name="chat")
      template(#title)
        .stats-dialog-tab-title
          AppIcon.stats-dialog-tab-title__icon(name="tabler:message" :width="20" :height="20")
          span.stats-dialog-tab-title__value {{ $t('chat.chat') }}
      Chat(ref="chatRef" @on-connected-ws="onConnectedWs" @on-chat-message-ws="onChatMessageWs")

    // Online Tab
    Tab(name="online")
      template(#title)
        .stats-dialog-tab-title
          AppIcon.stats-dialog-tab-title__icon(name="tabler:users-group" :width="20" :height="20")
          span.stats-dialog-tab-title__value {{ $t('tourMode.onlineUsers') }}

      TourModeUserList

    // Last answers Tab
    Tab(name="last-answers")
      template(#title)
        .stats-dialog-tab-title
          AppIcon.stats-dialog-tab-title__icon(name="tabler:pencil-question" :width="20" :height="20")
          span.stats-dialog-tab-title__value Son cevaplar

      TourModeUserList
</template>

<script>
import { defineComponent, reactive, ref, watch, useStore, nextTick } from '@nuxtjs/composition-api'
import { Dialog, Tabs, Tab, Cell } from 'vant'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    Tabs,
    Tab,
    Cell
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
    confirmButtonText: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props) {
    const store = useStore()
    const user = store.getters['auth/user']

    const state = reactive({
      isOpen: props.isOpen
    })

    const chatRef = ref(null)

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value

        if (value) {
          nextTick(() => {
            chatRef.value?.scrollToBottom()
          })

          setTimeout(() => {
            chatRef.value?.scrollToBottom()
          }, 100)
        }
      }
    )

    const activeTab = ref('chat')

    const onConnectedWs = () => {
      chatRef.value.scrollToBottom()
    }

    const onChatMessageWs = () => {
      chatRef.value.scrollToBottom()
    }

    return {
      user,
      state,
      chatRef,
      activeTab,
      onConnectedWs,
      onChatMessageWs
    }
  }
})
</script>

<style lang="scss" src="./TourModeOnlineDialog.component.scss"></style>
