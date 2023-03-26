<template lang="pug">
Dialog.how-to-play-dialog(
  v-model="state.isOpen"
  title="parolla Nasıl Oynanır?"
  :cancel-button-text="cancelButtonText"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
)
  .how-to-play-dialog__explain
    p Her harfe karşılık gelen sorunun cevabını bulmalısın, cevap o harf ile başlar.<br><br>
      | Örneğin: <strong>Bal yapan hayvan?</strong> sorusunda aktif harf <strong>A</strong> ve bunun cevabı <strong>Arı</strong>'dır gibi.<br><br>
      | Cevabın <strong>🟩 Doğru</strong> ya da <strong>🟥 Yanlış</strong> olabilir. <br> Eğer cevabı bilmiyorsan <strong>🟨 PAS</strong>
      | butonuna bas ya da pas yazıp gönder. Daha sonra o soruya dönebileceksin. Pasladığın soruları süren bitene kadar cevaplayabilirsin.
      | <br><br> Oyunun toplam süresi <strong>5 dakika</strong>'dır.
      | <br><small>Eğer sayfayı yenilersen oyun en baştan başlar</small>
      | <br><br> <strong>parolla</strong> oyunu <strong>{{ ALPHABET_LENGTH }}</strong> türkçe alfabe harfi içerir. Her gün yeni sorular gelir.
    .how-to-play-dialog__ad
      AppAd(:data-ad-slot="9964323575")

  // Footer
  footer.how-to-play-dialog__footer
    .d-flex
      RadKodLogo(:width="80" height="auto")
      span &nbsp;tarafından.
</template>

<script>
import { defineComponent, reactive, watch } from '@nuxtjs/composition-api'
import { ALPHABET_LENGTH } from '@/system/constant'
import { Dialog } from 'vant'
import { RadKodLogo } from '@/components/Logo'
import { AppAd } from '@/components/Ad'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    RadKodLogo,
    AppAd
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    cancelButtonText: {
      type: String,
      required: false,
      default: 'Kapat ve Başla'
    }
  },
  setup(props) {
    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
      }
    )

    return { ALPHABET_LENGTH, state }
  }
})
</script>

<style lang="scss" src="./HowToPlayDialog.component.scss"></style>
