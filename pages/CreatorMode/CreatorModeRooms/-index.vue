<template lang="pug">
.page.creator-mode-rooms-page
  .page.creator-mode-rooms-page__inner
    h2.creator-mode-rooms-page__title(align="center") ODALAR

    br

    .creator-mode-rooms-page-join-room
      h3.creator-mode-rooms-page__title ODA BAĞLANTISINI GİR
      Field.creator-mode-rooms-page-join-room__urlField(
        v-model="form.roomUrl.url"
        placeholder="Örn: https://parolla.app/room?id=aea23618"
        @input="validateRoomUrl"
        @keypress.native.enter="gotoRoom"
      )
        template(#left-icon)
          Icon(:name="require('@/assets/img/icons/svg/tabler/TablerLink.svg')")
        template(#button)
          Button(type="info" size="small" native-type="button" round :disabled="!form.roomUrl.isClear" @click="gotoRoom") ODAYA GİT

    Divider YA DA

    .creator-mode-rooms-page-rooms
      .creator-mode-rooms-page__title.creator-mode-rooms-page__title--rooms
        h3 LİSTEDEN SEÇ ({{ rooms.length }})
        Button.creator-mode-rooms-page-rooms__refetchButton(icon="replay" size="small" round @click="fetch") TAZELE

      Search.creator-mode-rooms-page-rooms__searchField(v-model="form.rooms.search" placeholder="Oda ara" @input="handleSearchRoom")

      .room-list
        template(v-if="fetchState.pending")
          Empty(description="Odalar getiriliyor...")

        template(v-else-if="fetchState.error")
          Empty(image="error" description="Veriler alınırken hata oluştu.")
            Button(@click="fetch") Tekrar Dene

        template(v-else)
          template(v-if="isEmptyRoomList")
            Empty(description="Oda bulunamadı, kendi soru-cevap setini oluşturmak için hemen oda kur!")
              Button(type="info" icon="plus" native-type="button" round @click="$router.push({ name: 'CreatorModeCompose' })") Oda oluştur

          template(v-else)
            template(v-for="room in form.rooms.search.length > 0 ? filteredRooms : rooms")
              Cell(v-if="room.isPublic" :label="`ID: ${room.id}`" is-link :to="`/room?id=${room.id}`" :title="room.title")
</template>

<script>
import { defineComponent, useFetch, useRouter, useStore, ref, reactive, computed } from '@nuxtjs/composition-api'
import { Field, Search, Button, Icon, Divider, Cell, Empty, Notify } from 'vant'

export default defineComponent({
  components: {
    Field,
    Search,
    Button,
    Icon,
    Divider,
    Cell,
    Empty,
    Notify
  },
  layout: 'Default/Default.layout',
  setup() {
    const router = useRouter()
    const store = useStore()

    // Fetch Rooms
    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('creator/fetchRooms')
    })

    const rooms = computed(() => store.getters['creator/rooms'])
    const filteredRooms = ref([])

    const form = reactive({
      roomUrl: {
        isClear: false,
        pattern: /^(https?:\/\/)?(www\.)?parolla\.app\/room\?id=.+$/,
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

        router.push({ name: 'CreatorModeRoom', query: { id } })
      } else {
        Notify({
          message: `Odaya gidilemedi, lütfen girdiğin bağlantıyı kontrol et`,
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
