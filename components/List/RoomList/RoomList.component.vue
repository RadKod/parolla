<template lang="pug">
.room-list
  Search.room-list__searchField(
    v-model="form.search.keyword"
    :placeholder="$t('creatorModeRooms.rooms.searchField.placeholder')"
    :clearable="false"
    @input="handleSearchRoom"
  )
    template(#right-icon)
      Loading(v-if="form.search.isBusy" color="var(--color-info-01)" size="16")

  template(v-if="items && items.length <= 0")
    Empty(:description="$t('creatorModeRooms.rooms.empty.description')")
      Button(
        type="info"
        icon="plus"
        native-type="button"
        round
        @click="$router.push(localePath({ name: 'CreatorMode-CreatorModeCompose' }))"
      ) {{ $t('creatorModeRooms.rooms.empty.action') }}

  template(v-else)
    List
      template(v-for="(room, index) in list.items")
        NuxtLink(
          :to="localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: room.id } })"
          :title="room.title"
          @click.native.prevent.capture="localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: room.id } })"
        )
          Cell.room-list-item(is-link :to="localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: room.id } })")
            template(#title)
              span.room-list-item__title {{ room.title }}

            template(#label)
              .room-list-item-badge.room-list-item-badge--user.d-flex.d-mobile-none(v-if="room.user")
                PlayerAvatar(:size="16" :user="room.user")
                span.room-list-item-badge__value {{ room.user.username }}

              .room-list-item__badges
                .room-list-item-badge.room-list-item-badge--user(v-if="room.user")
                  PlayerAvatar(:size="16" :user="room.user")
                  span.room-list-item-badge__value {{ room.user.username }}

                .room-list-item-badge(v-if="room.questionCount")
                  AppIcon.room-list-item-badge__icon(name="tabler:help-circle" color="var(--color-text-03)" :width="16" :height="16")
                  span.room-list-item-badge__value {{ room.questionCount }}

                .room-list-item-badge(v-if="room.viewCount && room.viewCount > 0")
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

              // Actions
              .room-list-item__actions(v-if="user && isOwner({ user: room.user })")
                Button(
                  type="info"
                  icon="edit"
                  native-type="button"
                  plain
                  size="normal"
                  round
                  @click.native.stop.prevent.capture="$router.push(localePath({ name: 'CreatorMode-CreatorModeEdit', query: { id: room.id } }))"
                ) {{ $t('general.edit') }}
                Button(
                  type="danger"
                  icon="delete"
                  native-type="button"
                  plain
                  round
                  size="normal"
                  @click.native.stop.prevent.capture="handleDeleteRoom({ room })"
                )
                  | {{ $t('general.delete') }}

        // Ad
        template(v-if="(index + 1) % 5 === 0")
          .room-list-item.room-list-item--ad
            small {{ $t('general.ad') }}
            AppAd(:data-ad-slot="6048083070")

  InfiniteLoading(v-if="isActiveInfiniteLoading && list.items.length >= 10" @infinite="handleInfiniteLoading")
</template>

<script>
import { defineComponent, useContext, useStore, reactive, computed, watch } from '@nuxtjs/composition-api'
import { useDebounceFn } from '@vueuse/core'
import { Search, List, Cell, Button, Empty, Loading, Dialog, Notify } from 'vant'
import InfiniteLoading from 'vue-infinite-loading'
import StarRating from 'vue-star-rating'

export default defineComponent({
  components: {
    Search,
    List,
    InfiniteLoading,
    Cell,
    Button,
    Empty,
    Loading,
    StarRating,
    Dialog,
    Notify
  },
  props: {
    items: {
      type: Array,
      required: false,
      default: null
    },
    user: {
      type: Object,
      required: false,
      default: null
    },
    isActiveInfiniteLoading: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup(props, { emit }) {
    const { i18n } = useContext()
    const store = useStore()
    const { isOwner } = useAuth()

    const { formatRating } = useFormatter()

    const pagination = computed(() => store.getters['creator/roomsPagination'])

    const list = reactive({
      items: props.items,
      originalItems: props.items // Store original items for local search
    })

    watch(
      () => props.items,
      value => {
        list.items = value
        list.originalItems = value // Update original items when props change
      }
    )

    const handleInfiniteLoading = async $state => {
      const { data, error } = await store.dispatch('creator/fetchRooms', {
        isLoadMore: true,
        page: pagination.value.page + 1,
        keyword: form.search.keyword,
        user: props.user?.id
      })

      $state.loaded()

      if (data?.data.length === 0) {
        $state.complete()

        return false
      }

      if (error) {
        $state.error()

        return false
      }
    }

    const form = reactive({
      search: {
        isBusy: false,
        keyword: ''
      }
    })

    const fetchRooms = useDebounceFn(
      async () => {
        if (props.isActiveInfiniteLoading) {
          await store.dispatch('creator/fetchRooms', {
            keyword: form.search.keyword,
            user: props.user?.id
          })
        } else {
          // Local filter for rooms
          if (form.search.keyword.trim() === '') {
            // If search is empty, restore original items
            list.items = list.originalItems.slice()
          } else {
            // Filter original items based on search keyword
            list.items = list.originalItems.filter(room => {
              return room.title.toLowerCase().includes(form.search.keyword.toLowerCase())
            })
          }
        }

        form.search.isBusy = false
      },
      1000,
      { maxWait: 5000 }
    )

    const handleSearchRoom = async () => {
      form.search.isBusy = true
      await fetchRooms()
    }

    const handleDeleteRoom = async ({ room }) => {
      Dialog.confirm({
        title: i18n.t('general.delete'),
        message: `${i18n.t('general.delete')}: ${room.title}`,
        cancelButtonText: i18n.t('general.cancel'),
        confirmButtonText: i18n.t('general.delete')
      }).then(() => {
        deleteRoom({ documentId: room.documentId })
      })
    }

    const deleteRoom = async ({ documentId }) => {
      const { data, error } = await store.dispatch('creator/deleteRoom', { documentId })

      if (data) {
        Notify({
          message: i18n.t('creatorModeMyRooms.delete.callback.success'),
          color: 'var(--color-text-04)',
          background: 'var(--color-success-01)',
          duration: 1000
        })

        list.items = list.items.filter(room => room.documentId !== documentId)

        emit('on-delete-room', { documentId })
      }

      if (error) {
        Notify({
          message: error.message,
          color: 'var(--color-text-04)',
          background: 'var(--color-danger-01)',
          duration: 1000
        })
      }
    }

    return {
      isOwner,
      formatRating,
      list,
      pagination,
      handleInfiniteLoading,
      form,
      handleSearchRoom,
      handleDeleteRoom
    }
  }
})
</script>

<style lang="scss" src="./RoomList.component.scss"></style>
