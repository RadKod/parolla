import { GAME_TIME_LIMIT } from '@/system/constant'

export default () => ({
  isGameOver: false,
  alphabet: {
    activeIndex: 0,
    items: [
      {
        letter: 'A',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'B',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'C',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'Ç',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'D',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'E',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'F',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'G',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'H',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'İ',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'K',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'L',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'M',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'N',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'O',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'Ö',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'P',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'R',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'S',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'Ş',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'T',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'U',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'Ü',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'V',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'Y',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      },
      {
        letter: 'Z',
        isPassed: false,
        isWrong: false,
        isCorrect: false
      }
    ]
  },
  questions: [],
  countdown: {
    time: GAME_TIME_LIMIT
  },
  dialog: {
    stats: {
      isOpen: false
    }
  }
})
