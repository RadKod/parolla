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
        h3 {{ $t('creatorModeRooms.rooms.selectFromList') }} ({{ rooms.length }})
        Button.creator-mode-rooms-page-rooms__refetchButton(icon="replay" size="small" round @click="fetch")
          | {{ $t('creatorModeRooms.rooms.refresh') }}

      Search.creator-mode-rooms-page-rooms__searchField(
        v-model="form.rooms.search"
        :placeholder="$t('creatorModeRooms.rooms.searchField.placeholder')"
        :clearable="false"
        @input="handleSearchRoom"
      )

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
            template(v-for="room in form.rooms.search.length > 0 ? filteredRooms : rooms")
              Cell.room-list-item(
                v-if="room.isListed"
                is-link
                :to="localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: room.id } })"
              )
                template(#title)
                  span.room-list-item__title {{ room.title }}

                template(#label)
                  .room-list-item-badge.room-list-item-badge--user.d-flex.d-mobile-none(v-if="room.user")
                    PlayerAvatar(:size="16" :name="room.user.fingerprint")
                    span.room-list-item-badge__value {{ room.user.username }}

                  .room-list-item__badges
                    .room-list-item-badge.room-list-item-badge--user(v-if="room.user")
                      PlayerAvatar(:size="16" :name="room.user.fingerprint")
                      span.room-list-item-badge__value {{ room.user.username }}

                    .room-list-item-badge(v-if="room.questionCount")
                      AppIcon.room-list-item-badge__icon(name="tabler:help-circle" color="var(--color-text-03)" :width="16" :height="16")
                      span.room-list-item-badge__value {{ room.questionCount }}

                    .room-list-item-badge(v-if="room.viewCount")
                      AppIcon.room-list-item-badge__icon(name="tabler:eye" color="var(--color-text-03)" :width="16" :height="16")
                      span.room-list-item-badge__value {{ room.viewCount }}

                    .room-list-item-badge.room-list-item-badge--rating(v-if="room.rating")
                      StarRating(
                        read-only
                        inline
                        :show-rating="false"
                        :rating="room.rating"
                        :increment="0.1"
                        :rounded-corners="false"
                        :star-size="14"
                      )
                      label {{ String(formatRating(room.rating)) }}
                  span.room-list-item__id ID: {{ room.id }}
</template>

<script>
import { defineComponent, useFetch, useRouter, useContext, useStore, ref, reactive, computed } from '@nuxtjs/composition-api'
import { APP_URL } from '@/system/constant'
import { useFormatter } from '@/hooks'
import { Field, Search, Button, Divider, Cell, Empty, Notify } from 'vant'
import StarRating from 'vue-star-rating'
import { AppIcon } from '@/components/Icon'
import { PlayerAvatar } from '@/components/Avatar'

export default defineComponent({
  components: {
    Field,
    Search,
    Button,
    Divider,
    Cell,
    Empty,
    Notify,
    StarRating,
    AppIcon,
    PlayerAvatar
  },
  layout: 'Default/Default.layout',
  setup() {
    const router = useRouter()
    const { localePath, i18n } = useContext()
    const store = useStore()

    const { formatRating } = useFormatter()

    // Fetch Rooms
    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('creator/fetchRooms')
    })

    const rooms = computed(() => store.getters['creator/rooms'])
    const filteredRooms = ref([])

    const form = reactive({
      roomUrl: {
        isClear: false,
        pattern: /^(https?:\/\/)?(www\.)?parolla\.app\/(oda|en\/room)\?id=.+$/,
        url: ''
      },
      rooms: {
        search: ''
      }
    })

    const validateRoomUrl = () => {
      if (form.roomUrl.url.length > 0 && form.roomUrl.pattern.test(form.roomUrl.url)) {
        form.roomUrl.isClear = true
      } else {
        form.roomUrl.isClear = false
      }
    }

    const handleSearchRoom = () => {
      const pattern = `.*${form.rooms.search}.*`
      const regex = new RegExp(pattern, 'i')

      const filtered = rooms.value.filter(
        room =>
          // Search In Title
          regex.test(room.title) ||
          // Search In Id
          regex.test(room.id)
      )

      filteredRooms.value = filtered
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
      if (form.rooms.search.length > 0 ? filteredRooms.value.length <= 0 : rooms.value.length <= 0) {
        return true
      }
    })

    return {
      APP_URL,
      formatRating,
      fetch,
      fetchState,
      rooms,
      filteredRooms,
      form,
      validateRoomUrl,
      handleSearchRoom,
      gotoRoom,
      isEmptyRoomList
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeRooms.page.scss"></style>
