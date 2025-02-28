<template lang="pug">
.chat
  .chat__messages(ref="messagesRef")
    .chat__message(v-for="message in chatMessages" :key="message.timestamp" :class="{ 'chat__message--system': message.isSystem }")
      .chat__message-avatar
        PlayerAvatar(v-if="!message.isSystem" :user="message.playerName" :size="24")
      .chat__message-content
        .chat__message-sender {{ message.playerName }}:
        .chat__message-text {{ message.message }}
        .chat__message-time {{ isoToHumanDate(message.timestamp) }}

  .chat__input
    Field(v-model="messageText" placeholder="Type a message..." :border="false" @keypress.enter="sendMessage")
      template(#button)
        Button.chat__button.chat__button--send(
          color="var(--color-brand-02)"
          icon="guide-o"
          size="small"
          :inert="messageText.length <= 0"
          :disabled="messageText.length <= 0"
          @click="sendMessage"
        ) {{ $t('general.send') }}
</template>

<script>
import { defineComponent, ref, computed, useStore, onMounted, onUnmounted } from '@nuxtjs/composition-api'
import { Field, Button } from 'vant'
import { wsTypeEnum } from '@/enums'
import useFormatter from '@/composables/useFormatter'

export default defineComponent({
  name: 'Chat',
  components: {
    Field,
    Button
  },
  setup(_, { emit }) {
    const store = useStore()

    const { isoToHumanDate } = useFormatter()

    const messagesRef = ref(null)

    const messageText = ref('')

    const chatMessages = computed(() => store.getters['tour/chatMessages'])

    const ws = computed(() => store.getters['tour/ws'])

    const handleWsMessage = data => {
      const { type, chatHistory, playerId, playerName, message, isSystem, timestamp } = JSON.parse(data.data)

      if (type === wsTypeEnum.CONNECTED) {
        store.commit('tour/SET_CHAT_MESSAGES', chatHistory)

        setTimeout(() => {
          scrollToBottom()
        }, 0)

        emit('on-connected-ws')
      }

      if (type === wsTypeEnum.CHAT_MESSAGE) {
        const isDuplicate = chatMessages.value.some(msg => msg.timestamp === timestamp)

        if (!isDuplicate) {
          store.commit('tour/SET_CHAT_MESSAGES', [
            ...chatMessages.value,
            {
              isSystem,
              playerId,
              playerName,
              message,
              timestamp
            }
          ])

          setTimeout(() => {
            scrollToBottom()
          }, 0)
        }

        emit('on-chat-message-ws')
      }
    }

    onMounted(() => {
      if (ws.value) {
        ws.value.addEventListener('message', handleWsMessage)
      }
    })

    onUnmounted(() => {
      if (ws.value) {
        ws.value.removeEventListener('message', handleWsMessage)
      }
    })

    const scrollToBottom = () => {
      if (messagesRef.value) {
        setTimeout(() => {
          messagesRef.value.scrollTo({
            top: messagesRef.value.scrollHeight,
            behavior: 'smooth'
          })
        }, 0)
      }
    }

    const sendMessage = () => {
      if (!messageText.value.trim()) return

      ws.value.send(
        JSON.stringify({
          type: wsTypeEnum.CHAT_MESSAGE,
          message: messageText.value
        })
      )

      messageText.value = ''
    }

    return {
      messagesRef,
      messageText,
      chatMessages,
      sendMessage,
      isoToHumanDate,
      scrollToBottom
    }
  }
})
</script>

<style lang="scss" src="./Chat.component.scss"></style>
