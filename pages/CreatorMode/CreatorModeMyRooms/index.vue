<template lang="pug">
.page.creator-mode-my-rooms-page
  .page.creator-mode-my-rooms-page__inner
    h2.creator-mode-my-rooms-page__title(align="center") {{ $t('creatorModeMyRooms.title') }}
    p.creator-mode-my-rooms-page__description {{ $t('creatorModeMyRooms.description') }}

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
          template(v-for="room in myRooms")
            Cell.room-list-item(is-link :to="localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: room.id } })")
              template(#title)
                span.room-list-item__title {{ room.title }}

              template(#label)
                span.room-list-item__id ID: {{ room.id }}
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
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
    const storagedMyRooms = JSON.parse(window.localStorage.getItem('myRooms')) || []

    const myRooms = computed(() => {
      return storagedMyRooms
    })

    const isEmptyRoomList = computed(() => {
      if (myRooms.value && myRooms.value.length <= 0) {
        return true
      }
    })

    return {
      myRooms,
      isEmptyRoomList
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeMyRooms.page.scss"></style>
