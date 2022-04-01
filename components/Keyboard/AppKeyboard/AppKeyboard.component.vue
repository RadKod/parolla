<template lang="pug">
.keyboard.app-keyboard
</template>

<script>
import { defineComponent, ref, nextTick, onMounted, watch, onUnmounted } from '@vue/composition-api'
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
          default: ['q w e r t y u ı o p ğ ü', 'a s d f g h j k l ş i', 'z x c v b n m ö ç {backspace}', '{pass} {space} {enter}'],
          shift: ['Q W E R T Y U I O P Ğ Ü', 'A S D F G H J K L Ş İ', 'Z X C V B N M Ö Ç {backspace}', '{pass} {space} {enter}']
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

    const destroyKeyboard = () => {
      keyboard.value.destroy()
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

    const handleCapsLock = async event => {
      let initialLayoutName = keyboard.value.options.layoutName
      let layoutName = initialLayoutName === 'default' ? 'shift' : 'default'

      if (event && event.getModifierState('CapsLock')) {
        await keyboard.value.setOptions({
          layoutName: 'shift'
        })
      }

      if (event.code === 'CapsLock') {
        await keyboard.value.setOptions({
          layoutName: layoutName
        })
      }
    }

    const registerHandleCapsLock = () => {
      document.addEventListener('keyup', event => handleCapsLock(event))
    }

    const destroyHandleCapsLock = () => {
      document.removeEventListener('keyup', handleCapsLock)
    }

    onMounted(() => {
      initKeyboard()
      registerHandleCapsLock()
    })

    onUnmounted(() => {
      destroyHandleCapsLock()
      destroyKeyboard()
    })

    watch(
      () => props.input,
      value => {
        keyboard.value.setInput(value)

        if (value.trim().length > 0) {
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
