<template lang="pug">
.page.creator-mode-my-rooms-page
  .page.creator-mode-my-rooms-page__inner
    h2.creator-mode-my-rooms-page__title(align="center") {{ $t('creatorModeMyRooms.title') }}
    p.creator-mode-my-rooms-page__description {{ $t('creatorModeMyRooms.description') }}

    br

    .creator-mode-my-rooms-page-rooms
      .room-list
        template(v-if="fetchState.pending")
          Empty(:description="$t('creatorModeRooms.rooms.pendingRooms')")

        template(v-else-if="fetchState.error")
          Empty(image="error" :description="$t('creatorModeRooms.error.rooms.fetchError.description')")
            Button(@click="fetch") {{ $t('creatorModeRooms.error.rooms.fetchError.action') }}

        template(v-else)
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
import { defineComponent, useStore, useFetch, ref, watch, computed } from '@nuxtjs/composition-api'
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
    const store = useStore()

    // Fetch Rooms
    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('creator/fetchRooms')
    })

    const storagedMyRooms = JSON.parse(window.localStorage.getItem('myRooms')) || []
    const rooms = ref([])

    watch(
      () => store.getters['creator/rooms'],
      value => {
        rooms.value = value
      }
    )

    const user = computed(() => store.getters['auth/user'])

    const myRooms = computed(() => {
      const filtered = rooms.value.filter(item => item.user?.fingerprint === user.value.fingerprint)

      function filterObjectsById(objects) {
        // Create an object to store the IDs and their corresponding objects
        const idMap = {}

        // Loop through each object
        for (let obj of objects) {
          // If the ID already exists in the map, remove it
          if (idMap[obj.id]) {
            delete idMap[obj.id]
          }
          // Add the object to the map with its ID as the key
          idMap[obj.id] = obj
        }

        // Convert the map back to an array and return it
        const result = Object.values(idMap)

        return result
      }

      const _rooms = filterObjectsById([...storagedMyRooms, ...filtered])

      return _rooms
    })

    const isEmptyRoomList = computed(() => {
      if (myRooms.value && myRooms.value.length <= 0) {
        return true
      }
    })

    return {
      fetch,
      fetchState,
      rooms,
      myRooms,
      isEmptyRoomList
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeMyRooms.page.scss"></style>
