<template lang="pug">
.room-featured-tag-list(ref="rootRef")
  .room-featured-tag-list__inner
    .room-featured-tag-list__tags
      template(v-for="tag in tags")
        Tag.room-featured-tag-list-tag(
          :key="tag.title"
          type="primary"
          :class="[getTagActiveClass(tag)]"
          @click.stop.prevent.capture="handleTagClick(tag)"
        )
          AppIcon.room-featured-tag-list-tag__icon(:name="tag.icon" :width="16" :height="16")
          span.room-featured-tag-list-tag__title {{ tag.title }}
</template>

<script>
import { defineComponent, useContext, ref } from '@nuxtjs/composition-api'
import { Tag } from 'vant'

export default defineComponent({
  components: {
    Tag
  },
  setup(props, { emit }) {
    const { route, i18n } = useContext()

    const rootRef = ref(null)

    const handleTagClick = value => {
      emit('on-tag-click', value)
    }

    const getTagActiveClass = tag => {
      const currentTags = route.value.query.tags?.toLocaleLowerCase(i18n.locale)

      // If there are no tags in the query or it's null, "Tümü" should be active
      if (!currentTags && tag.tagsFilter === null) {
        return 'room-featured-tag-list-tag--active'
      }

      // If there are tags in the query, make the matching one active
      if (currentTags === tag.tagsFilter?.toLocaleLowerCase(i18n.locale)) {
        return 'room-featured-tag-list-tag--active'
      }
    }

    return {
      rootRef,
      tags: [
        {
          title: 'Tümü',
          tagsFilter: null,
          icon: 'fluent-emoji-flat:diamond-with-a-dot'
        },
        {
          title: 'Genel Kültür',
          tagsFilter: 'GenelKültür',
          icon: 'fluent-emoji-flat:books'
        },
        {
          title: 'Müzik',
          tagsFilter: 'müzik',
          icon: 'fluent-emoji-flat:musical-note'
        },
        {
          title: 'Dizi-Film',
          tagsFilter: 'dizi,film',
          icon: 'fluent-emoji-flat:television'
        },
        {
          title: 'Oyun',
          tagsFilter: 'oyun,VideoOyunları,VideoOyunu',
          icon: 'fluent-emoji-flat:video-game'
        },
        {
          title: 'Dil Öğren',
          tagsFilter: 'ingilizce,ispanyolca,fransızca,almanca,italyanca,portekizce,japonca,çince',
          icon: 'fluent-emoji-flat:japanese-prohibited-button'
        },
        {
          title: 'Futbol',
          tagsFilter: 'futbol',
          icon: 'fluent-emoji-flat:soccer-ball'
        },
        {
          title: 'Basketbol',
          tagsFilter: 'basketbol',
          icon: 'fluent-emoji-flat:basketball'
        },
        {
          title: 'Tarih',
          tagsFilter: 'tarih',
          icon: 'fluent-emoji-flat:calendar'
        },
        {
          title: 'Bilim',
          tagsFilter: 'bilim',
          icon: 'fluent-emoji-flat:microscope'
        },
        {
          title: 'Coğrafya',
          tagsFilter: 'coğrafya',
          icon: 'fluent-emoji-flat:globe-showing-europe-africa'
        },
        {
          title: 'Otomobil',
          tagsFilter: 'otomobil,araba,arabalar',
          icon: 'twemoji:sport-utility-vehicle'
        },
        {
          title: 'Bayrak Bilmece',
          tagsFilter: 'bayrak,bayraklar,ülkebayrakları,bayrakbilmece',
          icon: 'flag:tr-4x3'
        }
      ],
      handleTagClick,
      getTagActiveClass
    }
  }
})
</script>

<style lang="scss" src="./RoomFeaturedTagList.component.scss"></style>
