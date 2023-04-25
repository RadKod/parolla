<template lang="pug">
.player-avatar
  Avatar.player-avatar__avatar(variant="beam" :name="name" :size="size")
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
      default: 'Player'
    }
  },
  setup() {}
})
</script>

<style lang="scss" src="./PlayerAvatar.component.scss"></style>
