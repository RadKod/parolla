<template lang="pug">
Form.creator-mode-compose-form(@keypress.enter.prevent @failed="handleFailed")
  h2.creator-mode-compose-form__title(align="center") {{ $t('form.creatorModeCompose.title') }}
  br
  h3.creator-mode-compose-form__title.mt-1 {{ $t('form.creatorModeCompose.roomInformations') }}
  .creator-mode-compose-form__roomInfo
    Field.creator-mode-compose-form__roomTitle(
      v-model="form.roomTitle"
      name="roomTitle"
      :label="$t('form.creatorModeCompose.room.roomTitle.label')"
      :placeholder="$t('form.creatorModeCompose.room.roomTitle.placeholder')"
      maxlength="64"
      show-word-limit
      :rules="[{ required: true, message: $t('form.isRequired', { model: $t('form.creatorModeCompose.room.roomTitle.label') }) }]"
    )
    Cell.creator-mode-compose-form__.creator-mode-compose-form__isListed
      template(#title)
        span {{ $t('form.creatorModeCompose.room.isListed.label') }}

      template(#right-icon)
        VanSwitch(v-model="form.isListed" :size="24")
    Cell.creator-mode-compose-form__isAnon
      template(#title)
        span {{ $t('form.creatorModeCompose.room.isAnon.label') }} &nbsp;
        small(v-if="user") ({{ user.username }})

      template(#right-icon)
        VanSwitch(v-model="form.isAnon" :size="24")
  h3.creator-mode-compose-form__title {{ $t('form.creatorModeCompose.qaSet') }}

  .compose-qa-list
    template(v-if="form.qaList && form.qaList.length > 0")
      // List
      .compose-qa-card(v-for="(item, index) in form.qaList")
        Field.creator-mode-compose-form__questionField(
          v-model="item.question"
          name="question"
          :label="$t('form.creatorModeCompose.qa.question.label')"
          :placeholder="$t('form.creatorModeCompose.qa.question.placeholder')"
          maxlength="120"
          rows="2"
          autosize
          show-word-limit
          :rules="[{ required: true, message: $t('form.isRequired', { model: $t('form.creatorModeCompose.qa.question.label') }) }]"
        )
        Field.creator-mode-compose-form__answerField(
          name="answer"
          :label="$t('form.creatorModeCompose.qa.answer.label')"
          :placeholder="$t('form.creatorModeCompose.qa.answer.label')"
          maxlength="120"
          show-word-limit
          rows="2"
          :formatter="formatAnswerField"
          :error-message="item.isMatched === false ? $t('form.creatorModeCompose.qa.answer.error.nonMatched') : null"
          :error="item.isMatched === false"
        )
          template(#input)
            input.van-field__control(
              :value="item.answer"
              :placeholder="$t('form.creatorModeCompose.qa.answer.placeholder')"
              maxlength="120"
              @input="e => getCharacter(e.target.value, { item, index })"
            )
        Field.creator-mode-compose-form__characterField(
          v-model="item.character"
          name="character"
          :label="$t('form.creatorModeCompose.qa.character.label')"
          :placeholder="$t('form.creatorModeCompose.qa.character.placeholder')"
          maxlength="1"
          readonly
          disabled
          :rules="[{ required: true, message: $t('form.isRequired', { model: $t('form.creatorModeCompose.qa.character.label') }) }]"
          @input="validateAnswer({ item, index })"
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
          ) {{ $t('general.remove') }}

    // Empty List
    template(v-else)
      Empty(:description="$t('form.creatorModeCompose.qa.empty.description')")
        // Add qa button
        Button.compose-qa-list__addQaButton(type="info" icon="plus" native-type="button" round @click="addItem")
          | {{ $t('form.creatorModeCompose.qa.empty.action') }}

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
    ) {{ $t('form.creatorModeCompose.qa.addMoreQuestion') }}

    Button(
      v-if="form.qaList && form.qaList.length > 1"
      type="warning"
      plain
      native-type="button"
      round
      :loading="form.isBusy"
      :disabled="form.isBusy"
      @click="handleClickDeleteDraft"
    ) {{ $t('form.creatorModeCompose.deleteDraft.action') }}

    p.creator-mode-compose-form__termsDescription(v-if="form.qaList && form.qaList.length > 0")
      | {{ $t('form.creatorModeCompose.termsDescription') }}

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
    ) {{ $t('form.creatorModeCompose.submit') }}

  CreatorModeCreatedRoomDialog(
    :isOpen="dialog.room.isOpen"
    :cancelButtonText="$t('dialog.createdRoom.joinRoom')"
    :room="createdRoom"
    @closed="handleCloseRoomDialog"
  )
</template>

<script>
import { defineComponent, useRouter, useContext, useStore, reactive, set, watch, computed } from '@nuxtjs/composition-api'
import { roomTransformer } from '@/transformers'
import { Form, Field, Cell, Switch, Button, Empty, Notify, Dialog } from 'vant'
// Absolute path due to bypass for hoisting
import CreatorModeCreatedRoomDialog from '@/components/Dialog/CreatorModeCreatedRoomDialog/CreatorModeCreatedRoomDialog.component'

export default defineComponent({
  components: {
    Form,
    Field,
    Cell,
    VanSwitch: Switch,
    Button,
    Empty,
    Dialog,
    CreatorModeCreatedRoomDialog
  },
  setup() {
    const baseClassName = 'creator-mode-compose-form'

    const router = useRouter()
    const { localePath, i18n } = useContext()
    const store = useStore()

    const user = computed(() => store.getters['auth/user'])

    const form = reactive({
      isBusy: false,
      isClear: false,
      roomTitle: '',
      isListed: true,
      isAnon: false,
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

    const getCharacter = (value, { item, index }) => {
      if (value && value.length > 0) {
        form.qaList[index].answer = value

        const answers = value.split(',')
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
          form.qaList[index].character = firstAnswerChar.toLocaleUpperCase('tr')
        }
      } else {
        form.qaList[index].character = ''
      }

      // Set word limit
      document.querySelectorAll(`.${baseClassName}__answerField`)[index].querySelector('.van-field__word-num').innerHTML = value.length

      setTimeout(() => {
        validateAnswer(value, { item, index })
      }, 100)
    }

    const validateAnswer = (value, { item, index }) => {
      if (item.character && item.character.length > 0 && value && value.length > 0) {
        const answers = value.split(',')

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

    const getErrorNotify = () => {
      Notify({
        message: i18n.t('form.creatorModeCompose.error.couldNotCreate'),
        color: 'var(--color-text-04)',
        background: 'var(--color-danger-01)',
        duration: 1000
      })
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
        const result = await store.dispatch('creator/postQaForm', { form, user: user.value })

        if (result.success) {
          createdRoom.title = result.data.title
          createdRoom.id = result.data.room

          dialog.room.isOpen = true

          resetForm()

          let storagedMyRooms = JSON.parse(window.localStorage.getItem('myRooms'))

          if (storagedMyRooms && storagedMyRooms.length > 0) {
            window.localStorage.setItem('myRooms', JSON.stringify([...storagedMyRooms, roomTransformer(result.data)]))
          } else {
            window.localStorage.setItem('myRooms', JSON.stringify([roomTransformer(result.data)]))
          }
        } else {
          getErrorNotify()
        }
      } else {
        getErrorNotify()
      }

      form.isBusy = false
    }

    const resetForm = () => {
      form.roomTitle = ''
      form.isListed = true
      form.isAnon = false
      form.qaList = []
    }

    const handleClickDeleteDraft = () => {
      Dialog.confirm({
        title: i18n.t('form.creatorModeCompose.deleteDraft.confirm.title'),
        message: i18n.t('form.creatorModeCompose.deleteDraft.confirm.description'),
        cancelButtonText: i18n.t('form.creatorModeCompose.deleteDraft.confirm.cancel'),
        confirmButtonText: i18n.t('form.creatorModeCompose.deleteDraft.confirm.confirm')
      }).then(() => {
        deleteDraft()
      })
    }

    const saveDraft = () => {
      window.localStorage.setItem('creatorFormDraft', JSON.stringify(form))
    }

    const storagedForm = JSON.parse(window.localStorage.getItem('creatorFormDraft'))

    if (storagedForm) {
      form.roomTitle = storagedForm.roomTitle
      form.isListed = storagedForm.isListed
      form.isAnon = storagedForm.isAnon
      form.qaList = storagedForm.qaList
    }

    const deleteDraft = () => {
      window.localStorage.removeItem('creatorFormDraft')
      resetForm()
    }

    const handleCloseRoomDialog = () => {
      router.push(
        localePath({
          name: 'CreatorMode-CreatorModeRoom',
          query: { id: createdRoom.id }
        })
      )
    }

    watch(form, value => {
      if (value.qaList && value.qaList.length > 0) {
        saveDraft()
      }
    })

    return {
      user,
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
      handleClickDeleteDraft,
      saveDraft,
      deleteDraft,
      createdRoom,
      dialog,
      handleCloseRoomDialog
    }
  }
})
</script>

<style lang="scss" src="./CreatorModeComposeForm.component.scss"></style>
