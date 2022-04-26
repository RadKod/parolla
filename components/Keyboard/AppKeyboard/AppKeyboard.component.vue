<template lang="pug">
.keyboard.app-keyboard(ref="rootRef")
</template>

<script>
import { defineComponent, ref, nextTick, onMounted, watch, onUnmounted } from '@vue/composition-api'
import { ANSWER_CHAR_LENGTH } from '@/system/constant'
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
    const rootRef = ref(null)
    const keyboard = ref(null)

    const initKeyboard = async () => {
      await nextTick()

      keyboard.value = new Keyboard('.app-keyboard', {
        mergeDisplay: true,
        physicalKeyboardHighlight: true,
        physicalKeyboardHighlightPress: true,
        useButtonTag: true,
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
        inputName: 'answerField',
        maxLength: {
          answerField: ANSWER_CHAR_LENGTH
        },
        onChange: input => {
          emit('onChange', input)
        },
        onKeyPress: button => {
          emit('onKeyPress', button)

          setLetterTooltip(button)
        }
      })

      disableKey('{enter}') // Initial disable key
    }

    const setLetterTooltip = button => {
      switch (button) {
        case '{backspace}':
          break

        case '{space}':
          break

        case '{pass}':
          break

        case '{enter}':
          break

        default:
          rootRef.value.querySelector(`.hg-standardBtn[data-skbtn="${button}"]`).style.setProperty('--visibility', 'visible')
          rootRef.value.querySelector(`.hg-standardBtn[data-skbtn="${button}"]`).style.setProperty('--opacity', '1')

          setTimeout(() => {
            rootRef.value.querySelector(`.hg-standardBtn[data-skbtn="${button}"]`).style.setProperty('--visibility', 'hidden')
            rootRef.value.querySelector(`.hg-standardBtn[data-skbtn="${button}"]`).style.setProperty('--opacity', '0')
          }, 160)
          break
      }
    }

    const destroyKeyboard = () => {
      keyboard.value.destroy()
    }

    const disableKey = key => {
      rootRef.value.querySelector(`.hg-button[data-skbtn="${key}"]`).classList.add('disabled')
    }

    const enableKey = key => {
      rootRef.value.querySelector(`.hg-button[data-skbtn="${key}"]`).classList.remove('disabled')
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

    return { rootRef }
  }
})
</script>

<style lang="scss" src="./AppKeyboard.component.scss"></style>
