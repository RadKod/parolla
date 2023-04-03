<template lang="pug">
.how-to-play-creator-mode-content
  p Her karaktere karşılık gelen sorunun cevabını bulmalısın, cevap o karakter ile başlar.<br><br>
    | Örneğin: <strong>Bal yapan hayvan?</strong> sorusunda aktif karakter <strong>A</strong> ve bunun cevabı <strong>Arı</strong>'dır gibi.<br><br>
    | Cevabın <strong>🟩 Doğru</strong> ya da <strong>🟥 Yanlış</strong> olabilir. <br> Eğer cevabı bilmiyorsan <strong>🟨 PAS</strong>
    | butonuna bas ya da pas yazıp gönder. Daha sonra o soruya dönebileceksin. Pasladığın soruları süren bitene kadar cevaplayabilirsin.
    | <br><br> Oyunun toplam süresi <strong>5 dakika</strong>'dır.
    | <br><small>Eğer sayfayı yenilersen oyun en baştan başlar</small>
    | <br>Bu soru cevap seti başka bir oyuncu tarafından hazırlandı
    | <br> {{ String(alphabet.items.length) }} soru ve {{ String(alphabet.items.length) }} cevap var.
    | Bu modu tekrar tekrar oynayabilirsin.
</template>

<script>
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const store = useStore()

    const alphabet = computed(() => store.getters['creator/alphabet'])

    return {
      alphabet
    }
  }
})
</script>

<style lang="scss" src="./HowToPlayCreatorModeContent.component.scss"></style>
