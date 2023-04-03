<template lang="pug">
.page.creator-mode-room-page
  // GameScene
  CreatorModeGameScene
</template>

<script>
import { defineComponent, useRoute, useStore, useContext, useMeta, computed } from '@nuxtjs/composition-api'
import { APP_URL } from '@/system/constant'
import { CreatorModeGameScene } from '@/components/Scene'

export default defineComponent({
  components: {
    CreatorModeGameScene
  },
  layout: 'Default/Default.layout',
  setup() {
    const route = useRoute()
    const store = useStore()
    const { redirect } = useContext()

    if (!route.value.query.id) {
      redirect(`/creator/rooms`)
    }

    const room = computed(() => store.getters['creator/room'])

    useMeta(() => ({
      title: room.value?.title ? `${room.value.title} | parolla - Kelime oyunu` : `parolla - Kelime oyunu`,
      description: `Özel oluşturulmuş soru-cevap setini "${room.value.title}" odasında hemen oyna`,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: `${room.value.title} | parolla - Kelime oyunu`
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `${room.value.title} | parolla - Kelime oyunu`
        },
        {
          hid: 'description',
          name: 'description',
          content: `Özel oluşturulmuş soru-cevap setini "${room.value.title}" odasında hemen oyna`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: `Özel oluşturulmuş soru-cevap setini "${room.value.title}" odasında hemen oyna`
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: `Özel oluşturulmuş soru-cevap setini "${room.value.title}" odasında hemen oyna`
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${APP_URL}${route.value.fullPath}`
        },
        {
          hid: 'twitter:url',
          property: 'twitter:url',
          content: `${APP_URL}${route.value.fullPath}`
        }
      ]
    }))
  },
  head: {}
})
</script>

<style lang="scss" src="./CreatorModeRoom.page.scss"></style>
