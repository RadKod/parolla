<template lang="pug">
Form.creator-mode-compose-form(@keypress.enter.prevent @failed="handleFailed")
  h2.creator-mode-compose-form__title(align="center") ODA OLUŞTUR
  br
  h3.creator-mode-compose-form__title ODA BİLGİLERİ
  .creator-mode-compose-form__roomInfo
    Field.creator-mode-compose-form__roomTitle(
      v-model="form.roomTitle"
      name="roomTitle"
      label="Oda başlığı"
      placeholder="Oda başlığı yaz"
      maxlength="64"
      show-word-limit
      :rules="[{ required: true, message: 'Oda başlığı gereklidir' }]"
    )
    SwitchCell.creator-mode-compose-form__isPublic(v-model="form.isPublic" title="Açık odalarda listelensin mi?")
  h3.creator-mode-compose-form__title SORU-CEVAP SETİ

  .compose-qa-list
    template(v-if="form.qaList && form.qaList.length > 0")
      // List
      .compose-qa-card(v-for="(item, index) in form.qaList")
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
          placeholder="Cevapları virgül ile ayırabilirsin"
          maxlength="120"
          show-word-limit
          rows="2"
          :formatter="formatAnswerField"
          :error-message="item.isMatched === false ? 'Her cevap aynı karakterle başlamalı' : null"
          :error="item.isMatched === false"
          @input="getCharacter(item, index)"
        )
        Field(
          v-model="item.character"
          name="character"
          label="Karakter"
          placeholder="Soru karakteri"
          maxlength="1"
          readonly
          disabled
          :rules="[{ required: true, message: 'Karakter gereklidir' }]"
          @input="validateAnswer(item, index)"
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
      :loading="form.isBusy"
      :disabled="form.isBusy"
      @click="addItem"
    ) Başka soru ekle

    // Save list button
    Button.compose-qa-list__submitButton(
      v-if="form.qaList && form.qaList.length > 0"
      type="primary"
      icon="success"
      plain
      native-type="button"
      round
      :loading="form.isBusy"
      :disabled="form.isBusy"
      @click="handleSubmit"
    ) Bitir ve yayınla

  CreatorModeCreatedRoomDialog(:isOpen="dialog.room.isOpen" :room="createdRoom" @closed="handleCloseRoomDialog")
</template>

<script>
import { defineComponent, useRouter, useStore, reactive, set } from '@nuxtjs/composition-api'
import { Form, Field, SwitchCell, Button, Empty, Notify } from 'vant'
import { CreatorModeCreatedRoomDialog } from '@/components/Dialog'

export default defineComponent({
  components: {
    Form,
    Field,
    SwitchCell,
    Button,
    Empty,
    CreatorModeCreatedRoomDialog
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    const form = reactive({
      isBusy: false,
      isClear: false,
      roomTitle: '',
      isPublic: true,
      qaList: []
    })

    const createdRoom = reactive({
      title: '',
      id: ''
    })

    const dialog = reactive({
      room: {
        isOpen: false
      }
    })

    const addItem = () => {
      form.qaList.push({
        character: '',
        question: '',
        answer: '',
        isMatched: null
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

    const formatAnswerField = value => {
      const formattedValue = value.startsWith(' ') ? '' : value

      return formattedValue
    }

    const getCharacter = (item, index) => {
      if (item.answer && item.answer.length > 0) {
        const answers = item.answer.split(',')
        const firstAnswer = answers[0]
        const firstAnswerChar = firstAnswer.substring(0, 1)

        const isMatched = answers.every(answer => {
          const char = answer.substring(0, 1)

          if (
            char.toLocaleLowerCase('tr').trim().replace(/\s+/g, '') === firstAnswerChar.toLocaleLowerCase('tr').trim().replace(/\s+/g, '')
          ) {
            return true
          } else {
            return false
          }
        })

        if (isMatched) {
          form.qaList[index].character = firstAnswerChar
        }
      } else {
        form.qaList[index].character = ''
      }

      setTimeout(() => {
        validateAnswer(item, index)
      }, 100)
    }

    const validateAnswer = (item, index) => {
      if (item.character && item.character.length > 0 && item.answer && item.answer.length > 0) {
        const answers = item.answer.split(',')

        const isMatched = answers.every(answer => {
          if (answer.toLocaleLowerCase('tr').trim().replace(/\s+/g, '').startsWith(item.character.toLocaleLowerCase('tr'))) {
            return true
          } else {
            return false
          }
        })

        if (isMatched) {
          form.qaList[index].isMatched = true
        } else {
          form.qaList[index].isMatched = false
        }
      } else {
        form.qaList[index].isMatched = false
      }
    }

    const handleFailed = errorInfo => {
      if (errorInfo && errorInfo.values.length > 0) {
        form.isClear = false
      } else {
        form.isClear = true
      }
    }

    const handleSubmit = async () => {
      form.isBusy = true

      const nonMatchedItems = form.qaList.filter(item => {
        return item.isMatched === false
      })

      if (nonMatchedItems.length > 0) {
        form.isClear = false
      } else {
        form.isClear = true
      }

      if (form.isClear) {
        const result = await store.dispatch('creator/postQaForm', form)

        if (result.success) {
          createdRoom.title = result.data.title
          createdRoom.id = result.data.room

          dialog.room.isOpen = true

          resetForm()
        } else {
          Notify({
            message: `Oda oluşturulamadı, lütfen kontrol edip tekrar dene`,
            color: 'var(--color-text-04)',
            background: 'var(--color-danger-01)',
            duration: 1000
          })
        }
      } else {
        Notify({
          message: `Oda oluşturulamadı, lütfen kontrol edip tekrar dene`,
          color: 'var(--color-text-04)',
          background: 'var(--color-danger-01)',
          duration: 1000
        })
      }

      form.isBusy = false
    }

    const resetForm = () => {
      form.roomTitle = ''
      form.isPublic = true
      form.qaList = []
    }

    const handleCloseRoomDialog = () => {
      router.push(`/room?id=${createdRoom.id}`)
    }

    return {
      form,
      addItem,
      removeItem,
      moveUp,
      moveDown,
      disableMoveUp,
      disableMoveDown,
      formatAnswerField,
      getCharacter,
      validateAnswer,
      handleFailed,
      handleSubmit,
      createdRoom,
      dialog,
      handleCloseRoomDialog
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeComposeForm.component.scss"></style>
