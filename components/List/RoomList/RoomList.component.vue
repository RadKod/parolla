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
      template(v-for="room in list.items")
        Cell.room-list-item(v-if="room.isListed" is-link :to="localePath({ name: 'CreatorMode-CreatorModeRoom', query: { id: room.id } })")
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

  InfiniteLoading(@infinite="handleInfiniteLoading")
</template>

<script>
import { defineComponent, useStore, reactive, computed, watch } from '@nuxtjs/composition-api'
import { useFormatter } from '@/hooks'
import { useDebounceFn } from '@vueuse/core'
import { Search, List, Cell, Button, Empty, Loading } from 'vant'
import InfiniteLoading from 'vue-infinite-loading'
import StarRating from 'vue-star-rating'
import { AppIcon } from '@/components/Icon'
import { PlayerAvatar } from '@/components/Avatar'

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
    AppIcon,
    PlayerAvatar
  },
  props: {
    items: {
      type: Array,
      required: false,
      default: null
    }
  },
  setup(props, { emit }) {
    const store = useStore()

    const { formatRating } = useFormatter()

    const pagination = computed(() => store.getters['creator/roomsPagination'])

    const list = reactive({
      items: props.items
    })

    watch(
      () => props.items,
      value => {
        list.items = value
      }
    )

    const handleInfiniteLoading = async $state => {
      if (!pagination.value.cursor.next) {
        $state.complete()

        return false
      }

      await store.dispatch('creator/fetchRooms', {
        isLoadMore: true,
        cursor: pagination.value.cursor.next,
        keyword: form.search.keyword
      })

      $state.loaded()
    }

    const form = reactive({
      search: {
        isBusy: false,
        keyword: ''
      }
    })

    const fetchRooms = useDebounceFn(
      async () => {
        await store.dispatch('creator/fetchRooms', {
          keyword: form.search.keyword
        })
        form.search.isBusy = false
      },
      1000,
      { maxWait: 5000 }
    )

    const handleSearchRoom = async () => {
      form.search.isBusy = true
      await fetchRooms()
    }

    return {
      formatRating,
      list,
      pagination,
      handleInfiniteLoading,
      form,
      handleSearchRoom
    }
  }
})
</script>

<style lang="scss" src="./RoomList.component.scss"></style>
