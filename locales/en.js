export default {
  app: {
    name: 'parolla',
    domain: 'parolla.app',
    description: 'Solve daily questions and join the competition. Create your own Q&A set and solve fun questions created by players',
    publisher: 'RadKod',
    copyright: '{text} {spacer} {logo}'
  },
  error: {
    error: 'Hata',
    anErrorOccurred: 'Bir hata oluştu',
    tryAgain: 'Tekrar dene'
  },
  general: {
    loading: 'Loading',
    yes: 'Yes',
    no: 'No',
    ok: 'Tamam',
    cancel: 'Vazgeç',
    apply: 'Apply',
    question: 'Question',
    answer: 'Answer',
    remove: 'Remove',
    delete: 'Delete',
    open: 'Open',
    close: 'Close',
    playAgain: 'Play again',
    stats: 'Stats',
    dailyStats: `Today's stats`,
    share: 'Share',
    by: 'By'
  },
  introScene: {
    title: 'CHOOSE GAME MODE',
    modeList: {
      daily: {
        title: 'COMPETITIVE (DAILY)'
      },
      unlimited: {
        title: 'UNLIMITED'
      },
      creator: {
        title: 'CREATOR'
      }
    }
  },
  gameScene: {
    pendingQuestions: 'Fetching questions',
    answerField: {
      placeholder: 'Type answer',
      submit: 'SEND',
      pass: 'PASS'
    },
    correct: 'Correct',
    wrong: 'Incorrect',
    pass: 'Pass',
    remainTime: 'Remain time',
    scoreStats: 'Score chart',
    answerKey: 'Answer key',
    correctAnswer: 'Correct answer',
    yourAnswer: 'Your answer',
    halfTime: 'Half of the time is up',
    timeOver: 'Time is over',
    allQuestionsSeen: `If you can't think of an answer, you don't have to wait for the time, you can also type finish and finish it.`,
    radkodNotify: `Could we be the answer you're looking for? - RadKod.com`,
    unsupportedHeight: 'You should play on a bigger screen for a better experience',
    toast: {
      startGame: {
        title: `It's good to know`,
        description: '<ul> <li>If you want to end the game early, you can write <code>finish</code> and send it.</li> </ul>'
      }
    },
    skipAdShowScore: 'Skip the ad and see your score ⇥',
    error: {
      fetchQuestions: {
        title: 'Trouble fetching questions',
        action: 'Try again'
      },
      notStartsWithActiveChar: 'ANSWER MUST BEGIN WITH AN ACTIVE (ABOVE) CHARACTER'
    }
  },
  dialog: {
    menu: {
      title: 'More',
      darkTheme: 'Dark theme',
      suggestQa: 'Do you want to suggest a question?',
      howToCalculateStats: 'How we calculate the score',
      shareRoom: 'Share room',
      shareApp: `Share the parolla`,
      credits: 'Credits',
      contact: 'Contact'
    },
    howToCalculateStats: {
      title: 'How we calculate the score',
      description:
        'If your answer is correct, it is added to the correct questions, if incorrect, to the incorrect questions. <br><br> If you still have rusted questions when your time is up, these will be added to the questions you have passed. <br><br> And all the total results are shown on the statistics screen when the game is over.'
    },
    credits: {
      title: 'Credits',
      description:
        'parolla is an open source project. Check the <a href="https://github.com/RadKod/parolla" rel="nofollow,noopener" target="_blank">GitHub</a> link. <label>Project and UI <a href="https://twitter.com/selimdoyranli" target="_blank">@selimdoyranli</a></label> <label>Back-end and database <a href="https://twitter.com/apo_bozdag" target="_blank">@apo_bozdag</a></label> <label>Mobile app <a href="https://twitter.com/muratozakcil" target="_blank">@muratozakcil</a></label>'
    },
    contact: {
      title: 'Contact',
      description:
        'For suggestions, complaint, collaborations; <br><br> <a href="mailto:info@radkod.com?subject=parolla_contact">info@radkod.com</a> <br> or <br> <a href="https://twitter.com/parollaapp" target="_blank">@parollaapp</a> <br> You can reach us on our twitter account.'
    },
    createdRoom: {
      title: 'Room created',
      joinRoom: 'Join room',
      copyUrl: {
        callback: {
          success: 'Copied room URL'
        }
      }
    },
    howToPlay: {
      title: 'How to play parolla?',
      description: `
      You have to find the answer to the question corresponding to each character, the answer starts with that character.<br><br>
        For example: <strong>The fruit that fell on Newton's head?</strong> active character in question <strong>A</strong> and the answer is <strong>Apple</strong>.<br><br>
        Your answer may be <strong>🟩 Correct</strong> or <strong>🟥 Incorrect</strong>. <br> If you don't know the answer press the <strong>🟨 PASS</strong>
        button or type pass and send it. You can come back to that question later. You can answer the questions you pass until your time runs out.
        <br><br> The total duration of the game is <strong>5 minutes</strong>.
        <br><small>If you refresh the page the game starts from the beginning</small>`,
      body: `
        {description}
        {extra}
        `,
      daily: {
        extra:
          '<strong>parolla</strong> game contains <strong>{questionCount}</strong> English alphabet letters. New questions come every day.'
      },
      unlimited: {
        extra:
          '<strong>parolla</strong> game contains <strong>{questionCount}</strong> English alphabet letters. <br> You can play this mod over and over again. Different questions come up every time.'
      },
      creator: {
        extra:
          'This Q&A set was created by another player <br> There are {questionCount} questions and {questionCount} answers. You can play this mod over and over again.'
      },
      cancelButtonText: 'Close and Play'
    },
    stats: {
      clipboard: {
        score: {
          callback: {
            success: 'Copied your score'
          }
        }
      },
      empty: {
        description: 'When the game is over, <br> the statistics will be displayed here'
      },
      daily: {
        nextGame: 'Next game'
      }
    },
    interstitialAd: {
      title: 'We keep it up with ad support'
    },
    localeSwitch: {
      title: 'Choose language',
      switching: 'Switching'
    }
  },
  clipboard: {
    copy: 'Copy',
    callback: {
      success: 'Copied to clipboard',
      error: 'There was a problem and it was not copied'
    }
  },
  sharer: {
    app: {
      description: `parolla - Word game\n\n\Solve daily questions and join the competition. Create your own Q&A set and solve fun questions created by players \n\nhttps://parolla.app`
    },
    room: {
      description: `parolla - Word game \n\nPlay the player-generated Q&A set of {questionCount} questions in room "{roomTitle}"! \n \n{url}`
    },
    dailyModeStats: {
      description: `parolla - Word game \n\n{day} \n\n🟩 {correctAnswerCount} Correct \n🟥 {wrongAnswerCount} Incorrect \n🟨 {passedAnswerCount} Pass \n \nRemain time: {remainTime} \n \n{url}`
    },
    unlimitedModeStats: {
      description: `parolla - Word game \n\n(Unlimited game mode) \n\n🟩 {correctAnswerCount} Correct \n🟥 {wrongAnswerCount} Incorrect \n🟨 {passedAnswerCount} Pass \n \nRemain time: {remainTime} \n \n{url}`
    },
    creatorModeStats: {
      description: `parolla - Word game \n\nI played the player-generated Q&A set of {questionCount} questions in room "{roomTitle}" \n\n🟩 {correctAnswerCount} Correct \n🟥 {wrongAnswerCount} Incorrect \n🟨 {passedAnswerCount} Pass \n \nRemain time: {remainTime} \n \n{url}`
    }
  },
  creatorModeIntro: {
    description:
      '<strong>Player-generated question-answer sets</strong> &nbsp; <br> <strong>check out the rooms</strong> or create <strong>your own question-answer set</strong>',
    list: {
      rooms: {
        title: 'SEE ROOMS'
      },
      compose: {
        title: 'COMPOSE A ROOM'
      }
    }
  },
  creatorModeRooms: {
    title: 'ROOMS',
    joinRoom: {
      typeUrl: 'TYPE ROOM URL',
      url: {
        action: 'JOIN ROOM'
      }
    },
    divider: 'OR',
    rooms: {
      pendingRooms: 'Fetching rooms',
      selectFromList: 'SELECT FROM LIST',
      refresh: 'REFRESH',
      searchField: {
        placeholder: 'Search room'
      },
      empty: {
        description: 'No rooms found, create your own question-answer set!',
        action: 'Compose a room'
      }
    },
    error: {
      fetch: {
        description: 'There was a problem getting the rooms',
        action: 'Try again'
      },
      joinRoom: 'Could not go to the room, please check the link you entered'
    }
  },
  form: {
    isRequired: '{model} is required',
    creatorModeCompose: {
      title: 'COMPOSE A ROOM',
      roomInformations: 'ROOM INFORMATIONS',
      qaSet: 'QUESTION-ANSWER SET',
      room: {
        roomTitle: {
          label: 'Room title',
          placeholder: 'Type room title'
        },
        isPublic: {
          label: 'Wanna you listing on public rooms?'
        }
      },
      qa: {
        empty: {
          description: 'Q&A set is empty',
          action: 'Add questions'
        },
        question: {
          label: 'Question',
          placeholder: 'Type question'
        },
        answer: {
          label: 'Answer',
          placeholder: 'You can separate the answers with commas',
          error: {
            nonMatched: 'Every answer must start with the same character'
          }
        },
        character: {
          label: 'Character',
          placeholder: 'Question character'
        },
        addMoreQuestion: 'Add more question'
      },
      saveDraft: {
        action: 'Save draft',
        callback: {
          success: 'Saved for later, when it comes back it will be the same form'
        }
      },
      termsDescription:
        '* Avoid spam, hate speech, racist and insulting content when creating rooms. Such rooms will be deleted upon moderation detection. While creating a room, your IP address is stored in accordance with legal regulations.',
      submit: 'Finish and publish',
      error: {
        couldNotCreate: 'Could not create room, please check and try again'
      }
    }
  },
  seo: {
    main: {
      title: 'parolla - Word game',
      description: 'Solve daily questions and join the competition. Create your own Q&A set and solve fun questions created by players'
    }
  }
}