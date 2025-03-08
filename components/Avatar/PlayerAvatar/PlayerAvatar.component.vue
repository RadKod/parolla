<template lang="pug">
.player-avatar
  slot(name="prepend")

  .player-avatar-badge(v-if="isVisitor")
    AppIcon.player-avatar-badge__icon(name="hugeicons:anonymous" color="#fff" :width="16" :height="16")
  Avatar.player-avatar__avatar(variant="beam" :name="name || user.username" :size="size")
  span.player-avatar__username(v-if="withUsername") {{ user.username }}

  slot(name="append")
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
    name: {
      type: String,
      required: false,
      default: null
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
    },
    isVisitor: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup() {}
})
</script>

<style lang="scss" src="./PlayerAvatar.component.scss"></style>
