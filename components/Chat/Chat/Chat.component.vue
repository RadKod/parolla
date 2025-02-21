<template lang="pug">
.chat
  .chat__messages
    .chat__message(v-for="message in messages" :key="message.id")
      .chat__message-avatar
        PlayerAvatar(:name="message.sender" :size="24")
      .chat__message-content
        .chat__message-sender {{ message.sender }}:
        .chat__message-text {{ message.text }}
        .chat__message-time {{ message.time }}

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
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { Field, Button } from 'vant'

export default defineComponent({
  name: 'Chat',
  components: {
    Field,
    Button
  },
  setup() {
    const messageText = ref('')
    const messages = ref([
      {
        id: 1,
        sender: 'John',
        text: 'Hello everyone!',
        time: '10:00'
      },
      {
        id: 1,
        sender: 'John',
        text: 'Hello everyone!',
        time: '10:00'
      },
      {
        id: 1,
        sender: 'John',
        text: 'Hello everyone!',
        time: '10:00'
      },
      {
        id: 1,
        sender: 'John',
        text: 'Hello everyone!',
        time: '10:00'
      },
      {
        id: 1,
        sender: 'John',
        text: 'Hello everyone!',
        time: '10:00'
      },
      {
        id: 1,
        sender: 'John',
        text: 'Hello everyone!',
        time: '10:00'
      }
    ])

    const sendMessage = () => {
      if (!messageText.value.trim()) return

      messages.value.push({
        id: Date.now(),
        sender: 'You',
        text: messageText.value,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })

      messageText.value = ''
    }

    return {
      messageText,
      messages,
      sendMessage
    }
  }
})
</script>

<style lang="scss" src="./Chat.component.scss"></style>
