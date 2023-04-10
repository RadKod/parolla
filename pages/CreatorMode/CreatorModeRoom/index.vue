<template lang="pug">
.page.creator-mode-room-page
  // GameScene
  CreatorModeGameScene
</template>

<script>
import { defineComponent, useRoute, useStore, useContext, useMeta, computed } from '@nuxtjs/composition-api'
import { CreatorModeGameScene } from '@/components/Scene'

export default defineComponent({
  components: {
    CreatorModeGameScene
  },
  layout: 'Default/Default.layout',
  setup() {
    const route = useRoute()
    const { localePath, redirect, i18n } = useContext()
    const store = useStore()

    if (!route.value.query.id) {
      redirect(localePath({ name: 'CreatorMode-CreatorModeRooms' }))
    }

    const room = computed(() => store.getters['creator/room'])

    useMeta(() => ({
      title: room.value?.title ? `${room.value.title} | ${i18n.t('seo.main.title')}` : i18n.t('seo.main.title')
    }))
  },
  head: {}
})
</script>

<style lang="scss" src="./CreatorModeRoom.page.scss"></style>
