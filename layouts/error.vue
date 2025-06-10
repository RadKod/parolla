<template lang="pug">
.error-layout
  .error-layout__inner
    .error-layout__content
      .error-layout__title {{ errorObj.statusCode }}
      .error-layout__description {{ errorObj.message }}

      .error-layout__actions
        Button.error-layout__goToHomeButton(color="var(--color-brand-02)" @click="goToHome") {{ $t('error.goToHome') }}
</template>

<script lang="ts">
import { defineComponent, useRouter, useContext } from '@nuxtjs/composition-api'
import { Button } from 'vant'

export default defineComponent({
  components: {
    Button
  },
  layout: 'Default/Default.layout',
  props: {
    error: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  setup(props) {
    const { localePath } = useContext()
    const router = useRouter()

    const goToHome = () => {
      router.push(localePath({ name: 'Main' }))
    }

    return {
      errorObj: props.error,
      goToHome
    }
  }
})
</script>

<style lang="scss" src="./error.layout.scss"></style>
