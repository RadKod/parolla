<template lang="pug">
.keyboard.app-keyboard
</template>

<script>
import { defineComponent, ref, nextTick, onMounted, watch } from '@vue/composition-api'
// Simple Keyboard
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'

export default defineComponent({
  props: {
    input: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const keyboard = ref(null)

    const initKeyboard = async () => {
      await nextTick()

      keyboard.value = new Keyboard('.app-keyboard', {
        mergeDisplay: true,
        physicalKeyboardHighlight: true,
        physicalKeyboardHighlightPress: true,
        layoutName: 'default',
        layout: {
          default: ['q w e r t y u ı o p ğ ü', 'a s d f g h j k l ş i', 'z x c v b n m ö ç {backspace}', '{pass} {space} {enter}']
        },
        display: {
          '{space}': 'BOŞLUK',
          '{pass}': 'PAS',
          '{backspace}': '⌫',
          '{enter}': 'GÖNDER'
        },
        buttonAttributes: [
          {
            attribute: 'disabled',
            value: 'true',
            buttons: '{enter}'
          }
        ],
        inputName: 'answerField',
        maxLength: {
          answerField: 28
        },
        onChange: input => {
          emit('onChange', input)
        },
        onKeyPress: button => {
          emit('onKeyPress', button)
        }
      })
    }

    const disableKey = key => {
      keyboard.value.setOptions({
        buttonAttributes: [
          {
            attribute: 'disabled',
            value: 'true',
            buttons: key
          }
        ]
      })
    }

    const enableKey = key => {
      keyboard.value.setOptions({
        buttonAttributes: [
          {
            attribute: 'disabled',
            value: 'false',
            buttons: key
          }
        ]
      })
    }

    onMounted(() => {
      initKeyboard()
    })

    watch(
      () => props.input,
      value => {
        keyboard.value.setInput(value)

        if (value.length > 0) {
          enableKey('{enter}')
        } else {
          disableKey('{enter}')
        }
      }
    )
  }
})
</script>

<style lang="scss" src="./AppKeyboard.component.scss"></style>
