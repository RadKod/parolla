<template lang="pug">
.page.creator-mode-rooms-page
  .page.creator-mode-rooms-page__inner
    h2.creator-mode-rooms-page__title(align="center") {{ $t('creatorModeRooms.title') }}

    br

    .creator-mode-rooms-page-join-room
      h3.creator-mode-rooms-page__title {{ $t('creatorModeRooms.joinRoom.typeUrl') }}
      Field.creator-mode-rooms-page-join-room__urlField(
        v-model="form.roomUrl.url"
        :placeholder="`${APP_URL}${localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: 'a12345b' } })}`"
        @input="validateRoomUrl"
        @keypress.native.enter="gotoRoom"
      )
        template(#left-icon)
          AppIcon(name="tabler:link" color="var(--color-icon-01)" :width="20" :height="20")
        template(#button)
          Button(type="info" size="small" native-type="button" round :disabled="!form.roomUrl.isClear" @click="gotoRoom")
            | {{ $t('creatorModeRooms.joinRoom.url.action') }}

    Divider {{ $t('creatorModeRooms.divider') }}

    .creator-mode-rooms-page-rooms
      .creator-mode-rooms-page__title.creator-mode-rooms-page__title--rooms
        h3 {{ $t('creatorModeRooms.rooms.selectFromList') }} ({{ roomTotal }})
        Button.creator-mode-rooms-page-rooms__refetchButton(icon="replay" size="small" round @click="fetch")
          | {{ $t('creatorModeRooms.rooms.refresh') }}

      template(v-if="fetchState.pending")
        Empty(:description="$t('creatorModeRooms.rooms.pendingRooms')")

      template(v-else-if="fetchState.error")
        Empty(image="error" :description="$t('creatorModeRooms.error.rooms.fetch.description')")
          Button(@click="fetch") {{ $t('creatorModeRooms.error.rooms.fetch.action') }}

      template(v-else)
        RoomList(:items="rooms")
</template>

<script>
import { defineComponent, useFetch, useRouter, useContext, useStore, ref, reactive, computed } from '@nuxtjs/composition-api'
import { APP_URL } from '@/system/constant'
import { Field, Button, Divider, Empty, Notify } from 'vant'
import { AppIcon } from '@/components/Icon'
import { RoomList } from '@/components/List'

export default defineComponent({
  components: {
    Field,
    Button,
    Divider,
    Empty,
    Notify,
    AppIcon,
    RoomList
  },
  layout: 'Default/Default.layout',
  setup() {
    const router = useRouter()
    const { localePath, i18n } = useContext()
    const store = useStore()

    // Fetch Rooms
    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('creator/fetchRooms', {
        isLoadMore: false
      })
    })

    const rooms = computed(() => store.getters['creator/rooms'])
    const roomTotal = computed(() => store.getters['creator/roomTotal'])

    const filteredRooms = ref([])

    const form = reactive({
      roomUrl: {
        isClear: false,
        pattern: /^(https?:\/\/)?(www\.)?parolla\.app\/(oda|en\/room)\?id=.+$/,
        url: ''
      }
    })

    const validateRoomUrl = () => {
      if (form.roomUrl.url.length > 0 && form.roomUrl.pattern.test(form.roomUrl.url)) {
        form.roomUrl.isClear = true
      } else {
        form.roomUrl.isClear = false
      }
    }

    const gotoRoom = () => {
      if (form.roomUrl.isClear) {
        const id = form.roomUrl.url.split('id=')[1]

        router.push(
          localePath({
            name: 'CreatorMode-CreatorModeRoom',
            query: { id }
          })
        )
      } else {
        Notify({
          message: i18n.t('creatorModeRooms.error.joinRoom'),
          color: 'var(--color-text-04)',
          background: 'var(--color-danger-01)',
          duration: 1000
        })
      }
    }

    const isEmptyRoomList = computed(() => {
      if (rooms.value.length <= 0) {
        return true
      }
    })

    return {
      APP_URL,
      fetch,
      fetchState,
      rooms,
      roomTotal,
      filteredRooms,
      form,
      validateRoomUrl,
      gotoRoom,
      isEmptyRoomList
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeRooms.page.scss"></style>
