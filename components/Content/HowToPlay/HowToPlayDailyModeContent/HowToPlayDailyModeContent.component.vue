<template lang="pug">
.how-to-play-daily-mode-content
  p Her harfe karşılık gelen sorunun cevabını bulmalısın, cevap o harf ile başlar.<br><br>
    | Örneğin: <strong>Bal yapan hayvan?</strong> sorusunda aktif harf <strong>A</strong> ve bunun cevabı <strong>Arı</strong>'dır gibi.<br><br>
    | Cevabın <strong>🟩 Doğru</strong> ya da <strong>🟥 Yanlış</strong> olabilir. <br> Eğer cevabı bilmiyorsan <strong>🟨 PAS</strong>
    | butonuna bas ya da pas yazıp gönder. Daha sonra o soruya dönebileceksin. Pasladığın soruları süren bitene kadar cevaplayabilirsin.
    | <br><br> Oyunun toplam süresi <strong>5 dakika</strong>'dır.
    | <br><small>Eğer sayfayı yenilersen oyun en baştan başlar</small>
    | <br><br> <strong>parolla</strong> oyunu <strong>{{ String(ALPHABET_LENGTH) }}</strong> türkçe alfabe harfi içerir. Her gün yeni sorular gelir.
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { ALPHABET_LENGTH } from '@/system/constant'

export default defineComponent({
  setup() {
    return {
      ALPHABET_LENGTH
    }
  }
})
</script>

<style lang="scss" src="./HowToPlayDailyModeContent.component.scss"></style>
