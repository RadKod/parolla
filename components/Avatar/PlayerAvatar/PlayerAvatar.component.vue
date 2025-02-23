<template lang="pug">
.player-avatar(v-if="user")
  Avatar.player-avatar__avatar(variant="beam" :name="user.username" :size="size")
  span.player-avatar__username(v-if="withUsername") {{ user.username }}
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import Avatar from 'vue2-boring-avatars'

export default defineComponent({
  components: {
    Avatar
  },
  props: {
    size: {
      type: Number,
      required: false,
      default: 32
    },
    user: {
      type: Object,
      required: false,
      default: null
    },
    withUsername: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {}
})
</script>

<style lang="scss" src="./PlayerAvatar.component.scss"></style>
