<template lang="pug">
Form.creator-mode-compose-form(@submit="handleSubmit")
  h2.creator-mode-compose-form__title(align="center") ODA OLUŞTUR
  br
  h3.creator-mode-compose-form__title ODA BİLGİLERİ
  Field.creator-mode-compose-form__roomTitle(
    v-model="form.roomTitle"
    name="roomTitle"
    label="Oda başlığı"
    placeholder="Oda başlığı yaz"
    maxlength="120"
    :rules="[{ required: true, message: 'Oda başlığı gereklidir' }]"
  )
  h3.creator-mode-compose-form__title SORU-CEVAP SETİ

  .compose-qa-list
    template(v-if="form.qaList && form.qaList.length > 0")
      // List
      .compose-qa-card(v-for="(item, index) in form.qaList")
        Field(
          v-model="item.character"
          name="character"
          label="Karakter"
          placeholder="Hangi karakter için soru yazacaksın?"
          maxlength="1"
          :rules="[{ required: true, message: 'Karakter gereklidir' }]"
        )
        Field(
          v-model="item.question"
          name="question"
          label="Soru"
          placeholder="Soruyu yaz"
          maxlength="120"
          rows="2"
          autosize
          show-word-limit
          :rules="[{ required: true, message: 'Soru gereklidir' }]"
        )
        Field(
          v-model="item.answer"
          name="answer"
          label="Cevap"
          placeholder="Yazdığın sorunun cevabı nedir?"
          maxlength="120"
          show-word-limit
          rows="2"
          :rules="[{ required: true, message: 'Cevap gereklidir' }]"
        )

        .compose-qa-card__actions
          template(v-if="form.qaList && form.qaList.length > 1")
            Button.compose-qa-card__moveButton.compose-qa-card__moveButton--up(
              icon="arrow-up"
              round
              size="small"
              native-type="button"
              :disabled="disableMoveUp(index)"
              @click="moveUp(index)"
            )
            Button.compose-qa-card__moveButton.compose-qa-card__moveButton--down(
              icon="arrow-down"
              round
              size="small"
              native-type="button"
              :disabled="disableMoveDown(index)"
              @click="moveDown(index)"
            )

          Button.compose-qa-card__removeButton(
            type="danger"
            icon="cross"
            plain
            native-type="button"
            round
            size="small"
            @click="removeItem(index)"
          ) Kaldır

    // Empty List
    template(v-else)
      Empty(description="Soru cevap setin şu anda boş")
        // Add qa button
        Button.compose-qa-list__addQaButton(type="info" icon="plus" native-type="button" round @click="addItem") Soru ekle

    // Add qa button
    Button.compose-qa-list__addQaButton(
      v-if="form.qaList && form.qaList.length > 0"
      type="info"
      icon="plus"
      plain
      native-type="button"
      round
      @click="addItem"
    ) Başka Soru ekle

    // Save list button
    Button.compose-qa-list__submitButton(
      v-if="form.qaList && form.qaList.length > 0"
      type="primary"
      icon="success"
      plain
      native-type="submit"
      round
    ) Bitir ve yayınla
</template>

<script>
import { defineComponent, reactive, set } from '@nuxtjs/composition-api'
import { Form, Field, Button, Empty } from 'vant'

export default defineComponent({
  components: {
    Form,
    Field,
    Button,
    Empty
  },
  setup() {
    const form = reactive({
      roomTitle: '',
      qaList: []
    })

    const addItem = () => {
      form.qaList.push({
        character: '',
        question: '',
        answer: ''
      })
    }

    const removeItem = index => {
      form.qaList.splice(index, 1)
    }

    const moveUp = index => {
      const temp = form.qaList[index]
      set(form.qaList, index, form.qaList[index - 1])
      set(form.qaList, index - 1, temp)
    }

    const moveDown = index => {
      const temp = form.qaList[index]
      set(form.qaList, index, form.qaList[index + 1])
      set(form.qaList, index + 1, temp)
    }

    const disableMoveUp = index => index === 0
    const disableMoveDown = index => index === form.qaList.length - 1

    const handleSubmit = () => {
      console.log('submitted')
    }

    return {
      form,
      addItem,
      removeItem,
      moveUp,
      moveDown,
      disableMoveUp,
      disableMoveDown,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeComposeForm.component.scss"></style>
