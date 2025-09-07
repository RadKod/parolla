<template lang="pug">
.page.creator-mode-my-rooms-page
  .page.creator-mode-my-rooms-page__inner
    h2.creator-mode-my-rooms-page__title(align="center") {{ $t('creatorModeMyRooms.title') }} ({{ roomsTotal }})
    p.creator-mode-my-rooms-page__description
      template(v-if="$auth.loggedIn && $auth.user")
        | {{ $t('creatorModeMyRooms.description.authed') }}
      template(v-else)
        | {{ $t('creatorModeMyRooms.description.nonAuthed') }}

    br

    .creator-mode-my-rooms-page-rooms
      .room-list
        template(v-if="isEmptyRoomList")
          Empty(:description="$t('creatorModeRooms.rooms.empty.description')")
            Button(
              type="info"
              icon="plus"
              native-type="button"
              round
              @click="$router.push(localePath({ name: 'CreatorMode-CreatorModeCompose' }))"
            ) {{ $t('creatorModeRooms.rooms.empty.action') }}

        template(v-else)
          RoomList(
            :items="rooms"
            :user="$auth.user"
            :isActiveInfiniteLoading="$auth.loggedIn && $auth.user ? true : false"
            @on-delete-room="handleDeleteRoom"
          )
</template>

<script>
import { defineComponent, useContext, useStore, useFetch, computed } from '@nuxtjs/composition-api'
import { Field, Search, Button, Divider, Cell, Empty } from 'vant'

export default defineComponent({
  components: {
    Field,
    Search,
    Button,
    Divider,
    Cell,
    Empty
  },
  layout: 'Default/Default.layout',
  setup() {
    const context = useContext()
    const store = useStore()

    // Fetch Rooms
    const { fetch, fetchState } = useFetch(async () => {
      if (!context.$auth.loggedIn || !context.$auth.user) {
        return false
      }

      await store.dispatch('creator/fetchRooms', {
        isLoadMore: false,
        user: context.$auth.user?.id
      })
    })

    const usersRooms = computed(() => store.getters['creator/rooms'])
    const usersRoomTotal = computed(() => store.getters['creator/roomTotal'])

    const parseStoragedMyRooms = JSON.parse(window.localStorage.getItem('myRooms')) || []

    const storagedMyRooms = computed(() => {
      return parseStoragedMyRooms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    })

    const rooms = computed(() => {
      if (context.$auth.loggedIn && context.$auth.user) {
        return usersRooms.value
      } else {
        return storagedMyRooms.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
    })

    const roomsTotal = computed(() => {
      if (context.$auth.loggedIn && context.$auth.user) {
        return usersRoomTotal.value
      } else {
        return storagedMyRooms.value.length
      }
    })

    const isEmptyRoomList = computed(() => {
      if (rooms.value && rooms.value.length <= 0) {
        return true
      }
    })

    const handleDeleteRoom = () => {
      store.commit('creator/SET_ROOM_TOTAL', usersRoomTotal.value - 1)
    }

    return {
      rooms,
      roomsTotal,
      isEmptyRoomList,
      handleDeleteRoom
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeMyRooms.page.scss"></style>
