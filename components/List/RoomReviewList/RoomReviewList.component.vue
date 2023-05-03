<template lang="pug">
.list.room-review-list
  .room-review-list__head
    .room-review-list__rating.room-review-list__rating--desktop
      strong.room-review-list__title
        | {{ $t('roomReviewList.ratingTitle') }}
      StarRating(read-only :rating="formatRating(rating)" :increment="0.1" :rounded-corners="true" :star-size="32")

    .d-none.d-md-block
      slot(name="openFormButton")

  .room-review-list__rating.room-review-list__rating--mobile
    StarRating(read-only :rating="formatRating(rating)" :increment="0.1" :rounded-corners="true" :star-size="20")

  .room-review-list__title.mt-base
    strong {{ $t('roomReviewList.reviewsTitle') }} ({{ items && items.length }})
    .d-flex.d-md-none
      slot(name="openFormButton")

  template(v-if="items && items.length > 0")
    List.list.room-review-list__items
      Cell.room-review-list-item(v-for="(item, index) in items" :key="index")
        .room-review-list-item__head
          .room-review-list-item-user
            strong.room-review-list-item-user__username
              template(v-if="item.user")
                PlayerAvatar(:size="20" :name="item.user.fingerprint")
                span {{ item.user.username }}
              template(v-else) -
            small &nbsp; (
              AppIcon(name="tabler:star-filled" color="var(--color-text-03)" :width="10" :height="10")
              | {{ String(formatRating(item.rating)) }}
              | )

        .room-review-list-item__body
          .room-review-list-item-content
            p.room-review-list-item-content__description {{ item.comment }}

          .room-review-list-item-date
            AppIcon.room-review-list-item-date__icon(name="tabler:clock" color="var(--color-text-03)" :width="16" :height="16")
            Timeago.room-review-list-item-date__value(:datetime="item.createdAt" :auto-update="60" :locale="$i18n.locale")
  // Empty List
  template(v-else)
    Empty(:description="$t('roomReviewList.empty.description')")
      Button(type="info" icon="plus" native-type="button" round @click="$emit('onClickOpenRoomReviewForm')") {{ $t('roomReviewList.empty.action') }}
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useFormatter } from '@/hooks'
import { List, Cell, Empty, Button } from 'vant'
import StarRating from 'vue-star-rating'
import { AppIcon } from '@/components/Icon'
import { PlayerAvatar } from '@/components/Avatar'

export default defineComponent({
  components: {
    List,
    Cell,
    Empty,
    Button,
    StarRating,
    AppIcon,
    PlayerAvatar
  },
  props: {
    rating: {
      type: Number,
      required: false,
      default: null
    },
    items: {
      type: Array,
      required: false,
      default: null
    }
  },
  setup() {
    const { formatRating } = useFormatter()

    return {
      formatRating
    }
  }
})
</script>

<style lang="scss" src="./RoomReviewList.component.scss"></style>
