<template lang="pug">
.player-avatar(:class="{ 'player-avatar--clickable': openPlayerDialogOnClick }" @click="handleClickPlayerAvatar")
  slot(name="prepend")

  .player-avatar__avatarWrapper(:style="{ width: `${size}px`, height: `${size}px` }")
    // Visitor Badge
    .player-avatar-badge(v-if="isVisitor")
      AppIcon.player-avatar-badge__icon(name="hugeicons:anonymous" color="#fff" :width="16" :height="16")

    // GM Badge
    .player-avatar-badge.player-avatar-badge--gm(v-if="isGm")
      AppIcon.player-avatar-badge__icon(name="tabler:crown" color="#fff" :width="16" :height="16")

    Avatar.player-avatar__avatar(variant="beam" :name="name || user.username" :size="size")

  span.player-avatar__username(v-if="withUsername")
    | {{ user.username }}
    span.gm-username-extra(v-if="isGm") &nbsp;(GM)

  slot(name="append")
</template>

<script>
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'
import Avatar from 'vue2-boring-avatars'
import { Notify } from 'vant'

export default defineComponent({
  components: {
    Avatar,
    Notify
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
    },
    openPlayerDialogOnClick: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup(props) {
    const store = useStore()

    const openPlayerDialog = async () => {
      store.commit('user/SET_PLAYER_DIALOG_IS_OPEN', true)

      const result = await store.dispatch('user/fetchUser', { id: props.user.id })

      if (result.success) {
        store.commit('user/SET_USER', result.data.user)
      } else {
        Notify({
          message: `Oyuncu bilgileri getirilemedi`,
          color: 'var(--color-text-04)',
          background: 'var(--color-danger-01)',
          duration: 3000
        })
      }
    }

    const handleClickPlayerAvatar = async () => {
      if (props.openPlayerDialogOnClick) {
        await openPlayerDialog()
      }
    }

    const isGm = computed(() => {
      if (props.user?.id === 257116 || props.user?.id === 258270 || props.user?.id === 262467) {
        return true
      }

      return false
    })

    return { handleClickPlayerAvatar, isGm }
  }
})
</script>

<style lang="scss" src="./PlayerAvatar.component.scss"></style>
