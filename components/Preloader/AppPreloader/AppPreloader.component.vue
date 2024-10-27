<template lang="pug">
.app-preloader(v-if="preloader.isLoading")
  .app-preloader__inner
    AppLogo
    span.app-preloader__loadingText {{ $t('general.loading') }}...
</template>

<script>
import { defineComponent, computed, useStore, onMounted, nextTick } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const store = useStore()

    const preloader = computed(() => store.state.preloader)

    onMounted(() => {
      nextTick(() => {
        if (!preloader.isAttached) {
          setTimeout(() => {
            store.commit('preloader/HIDE_PRELOADER')
          }, 2000) // 2 second sleep
        }
      })
    })

    return { preloader }
  }
})
</script>

<style lang="scss" src="./AppPreloader.component.scss" />
