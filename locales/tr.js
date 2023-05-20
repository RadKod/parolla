export default {
  app: {
    name: 'parolla',
    domain: 'parolla.app',
    description: 'Günlük soruları çöz ve rekabete katıl. Kendi soru-cevap setini oluştur, oyuncuların oluşturduğu eğlenceli soruları çöz',
    publisher: 'RadKod',
    copyright: '{logo} {spacer} {text}'
  },
  error: {
    error: 'Hata',
    anErrorOccurred: 'Bir hata oluştu',
    tryAgain: 'Tekrar dene'
  },
  general: {
    loading: 'Yükleniyor',
    yes: 'Evet',
    no: 'Hayır',
    ok: 'Tamam',
    cancel: 'Vazgeç',
    apply: 'Uygula',
    question: 'Soru',
    answer: 'Cevap',
    remove: 'Kaldır',
    delete: 'Sil',
    open: 'Aç',
    close: 'Kapat',
    playAgain: 'Baştan oyna',
    stats: 'İstatistik',
    dailyStats: 'Bugünün istatistiği',
    share: 'Paylaş',
    by: 'tarafından',
    comments: 'Yorumlar'
  },
  introScene: {
    title: 'OYUN MODU SEÇ',
    modeList: {
      daily: {
        title: 'REKABETÇİ (GÜNLÜK)'
      },
      unlimited: {
        title: 'LİMİTSİZ'
      },
      creator: {
        title: 'YARATICI'
      }
    }
  },
  gameScene: {
    pendingQuestions: 'Sorular getiriliyor',
    answerField: {
      placeholder: 'Cevabı yaz',
      submit: 'GÖNDER',
      pass: 'PAS'
    },
    correct: 'Doğru',
    wrong: 'Yanlış',
    pass: 'Pas',
    remainTime: 'Kalan süre',
    scoreStats: 'Skor dağılımı',
    answerKey: 'Cevap anahtarı',
    correctAnswer: 'Doğru cevap',
    yourAnswer: 'Senin cevabın',
    halfTime: 'Sürenin yarısı doldu',
    timeOver: 'Süre doldu',
    allQuestionsSeen: 'Aklına bir cevap gelmezse süreyi beklemene gerek yok, bitir yazıp bitirebilirsin de',
    radkodNotify: 'Aradığın cevap biz olabilir miyiz? - RadKod.com',
    unsupportedHeight: 'Daha iyi bir deneyim için daha büyük bir ekranda oynamalısın',
    toast: {
      startGame: {
        title: 'Bilmende fayda var',
        description: '<ul> <li>Oyunu erkenden sonlandırmak istersen <code>bitir</code> yazıp gönderebilirsin.</li> </ul>'
      }
    },
    skipAdShowScore: 'Reklamı geç ve skorunu gör ⇥',
    error: {
      fetchQuestions: {
        description: 'Sorular getirilirken sorun çıktı',
        action: 'Tekrar dene'
      },
      notStartsWithActiveChar: 'CEVAP AKTİF (YUKARDAKİ) KARAKTERLE BAŞLAMALI'
    }
  },
  dialog: {
    menu: {
      title: 'Daha fazla',
      usernameEdit: 'Oyuncu adını değiştir',
      menu: 'Menü',
      darkTheme: 'Koyu tema',
      switchLocale: 'Dil değiştir',
      suggestQa: 'Soru önermek ister misin?',
      howToPLay: 'Nasıl oynanır?',
      howToCalculateStats: 'Skoru nasıl hesaplıyoruz',
      shareRoom: 'Odayı paylaş',
      reviewRoom: 'Odayı değerlendir',
      shareApp: `parolla'yı paylaş`,
      credits: 'Yapımcılar',
      contact: 'Bize ulaşın'
    },
    howToCalculateStats: {
      title: 'Skoru nasıl hesaplıyoruz',
      description:
        'Cevabın doğru ise doğru sorulara yanlış ise yanlış sorulara eklenir. <br><br> Eğer süren bittiğinde hala paslanmış soruların varsa bunlar da pasladığın sorulara eklenir. <br><br> Ve tüm toplam sonuç oyun bittiğinde istatistik ekranında gösterilir.'
    },
    credits: {
      title: 'Yapımcılar',
      description:
        'parolla açık kaynak bir projedir. <a href="https://github.com/RadKod/parolla" rel="nofollow,noopener" target="_blank">GitHub</a> bağlantısından ulaşabilirsin. <label>Proje ve Arayüz <a href="https://twitter.com/selimdoyranli" target="_blank">@selimdoyranli</a></label> <label>Arkaplan ve Veritabanı <a href="https://twitter.com/apo_bozdag" target="_blank">@apo_bozdag</a></label> <label>Mobil Uygulama <a href="https://twitter.com/muratozakcill" target="_blank">@muratozakcill</a></label>'
    },
    contact: {
      title: 'Bize ulaşın',
      description:
        'Öneri, şikayet ya da işbirliği için; <br><br> <a href="mailto:info@radkod.com?subject=parolla_contact">info@radkod.com</a> <br> veya <br> <a href="https://twitter.com/parollaapp" target="_blank">@parollaapp</a> <br> twitter hesabımızdan ulaşabilirsin.'
    },
    createdRoom: {
      title: 'Oda oluşturuldu',
      joinRoom: 'Odaya git',
      copyUrl: {
        callback: {
          success: 'Oda bağlantısı kopyalandı'
        }
      }
    },
    howToPlay: {
      title: 'parolla nasıl oynanır?',
      description: `
        Her karaktere karşılık gelen sorunun cevabını bulmalısın, cevap o karakter ile başlar.<br><br>
        Örneğin: <strong>Bal yapan hayvan?</strong> sorusunda aktif karakter <strong>A</strong> ve bunun cevabı <strong>Arı</strong>'dır gibi.<br><br>
        Cevabın <strong>🟩 Doğru</strong> ya da <strong>🟥 Yanlış</strong> olabilir. <br> Eğer cevabı bilmiyorsan <strong>🟨 PAS</strong>
        butonuna bas ya da pas yazıp gönder. Daha sonra o soruya dönebileceksin. Pasladığın soruları süren bitene kadar cevaplayabilirsin.
        <br><br> Oyunun toplam süresi <strong>5 dakika</strong>'dır.
        <br><small>Eğer sayfayı yenilersen oyun en baştan başlar</small>`,
      body: `
        {description}
        {extra}
        `,
      daily: {
        extra: '<strong>parolla</strong> oyunu <strong>{questionCount}</strong> türkçe alfabe harfi içerir. Her gün yeni sorular gelir.'
      },
      unlimited: {
        extra:
          '<strong>parolla</strong> oyunu <strong>{questionCount}</strong> türkçe alfabe harfi içerir. <br> Bu modu tekrar tekrar oynayabilirsin. Her defasında farklı sorular gelir'
      },
      creator: {
        extra:
          'Bu soru cevap seti başka bir oyuncu tarafından hazırlandı <br> {questionCount} soru ve {questionCount} cevap var. Bu modu tekrar tekrar oynayabilirsin.'
      },
      cancelButtonText: 'Kapat ve Başla'
    },
    stats: {
      clipboard: {
        score: {
          callback: {
            success: 'Skorun kopyalandı'
          }
        }
      },
      empty: {
        description: 'Oyun bittiğinde <br> istatistik burada görünecek.'
      },
      daily: {
        nextGame: 'Sonraki oyun'
      }
    },
    interstitialAd: {
      title: 'Reklam desteğiyle bunu sürdürüyoruz'
    },
    localeSwitch: {
      title: 'Dil değiştir',
      switching: 'Değiştiriliyor'
    },
    leave: {
      title: 'Onaylıyor musun?',
      description: 'Yaptığın şeyleri tekrar yapmak zorunda kalabilirsin'
    },
    roomReview: {
      title: 'Oda değerlendirmeleri',
      review: 'Değerlendir',
      pendingReviews: 'Yorumlar getiriliyor',
      error: {
        fetchReviews: {
          description: 'Yorumlar getirilemedi',
          action: 'Tekrar dene'
        }
      }
    }
  },
  clipboard: {
    copy: 'Kopyala',
    callback: {
      success: 'Panoya kopyalandı',
      error: 'Bir sorun oluştu ve kopyalanmadı'
    }
  },
  sharer: {
    app: {
      description: `parolla - Kelime oyunu\n\n\Günlük soruları çöz ve rekabete katıl. Kendi soru-cevap setini oluştur, oyuncuların oluşturduğu eğlenceli soruları çöz \n\nhttps://parolla.app`
    },
    room: {
      description: `parolla - Kelime oyunu \n\n"{roomTitle}" odasında {questionCount} soruluk özel soru-cevap setini oyna! \n \n{url}`
    },
    dailyModeStats: {
      description: `parolla - Kelime oyunu \n\n{day} \n\n🟩 {correctAnswerCount} Doğru \n🟥 {wrongAnswerCount} Yanlış \n🟨 {passedAnswerCount} Pas \n \nKalan Süre: {remainTime} \n \n{url}`
    },
    unlimitedModeStats: {
      description: `parolla - Kelime oyunu \n\n(Limitsiz oyun modu) \n\n🟩 {correctAnswerCount} Doğru \n🟥 {wrongAnswerCount} Yanlış \n🟨 {passedAnswerCount} Pas \n \nKalan Süre: {remainTime} \n \n{url}`
    },
    creatorModeStats: {
      description: `parolla - Kelime oyunu \n\n"{roomTitle}" odasında {questionCount} soruluk özel soru-cevap setini oynadım \n\n🟩 {correctAnswerCount} Doğru \n🟥 {wrongAnswerCount} Yanlış \n🟨 {passedAnswerCount} Pas \n \nKalan Süre: {remainTime} \n \n{url}`
    }
  },
  creatorModeIntro: {
    description:
      '<strong>Oyuncular tarafından oluşturulmuş soru-cevap setleri</strong> &nbsp; <br> Hemen <strong>odalara bak</strong> ya da <strong>kendi soru-cevap setini oluştur</strong>',
    list: {
      rooms: {
        title: 'ODALARA BAK'
      },
      compose: {
        title: 'ODA OLUŞTUR'
      },
      myRooms: {
        title: 'SON OLUŞTURDUĞUM ODALAR'
      }
    }
  },
  creatorModeRooms: {
    title: 'ODALAR',
    joinRoom: {
      typeUrl: 'ODA BAĞLANTISINI GİR',
      url: {
        action: 'ODAYA GİT'
      }
    },
    divider: 'YA DA',
    rooms: {
      pendingRooms: 'Odalar getiriliyor',
      selectFromList: 'LİSTEDEN SEÇ',
      refresh: 'TAZELE',
      searchField: {
        placeholder: 'Oda ara'
      },
      empty: {
        description: 'Oda bulunamadı, kendi soru-cevap setini oluşturmak için hemen oda kur!',
        action: 'Oda oluştur'
      }
    },
    error: {
      rooms: {
        fetch: {
          description: 'Odalar getirilirken bir sorun çıktı',
          action: 'Tekrar dene'
        }
      },
      joinRoom: 'Odaya gidilemedi, lütfen girdiğin bağlantıyı kontrol et'
    }
  },
  creatorModeMyRooms: {
    title: 'Son oluşturduğum odalar',
    description: '* Son oluşturduğun odalar tarayıcı belleğine kaydedilir, tarayıcı verileri sıfırlandığında bu liste temizlenir'
  },
  form: {
    isRequired: '{model} gereklidir',
    creatorModeCompose: {
      title: 'ODA OLUŞTUR',
      clearForm: 'Formu Temizle',
      roomInformations: 'ODA BİLGİLERİ',
      qaSet: 'SORU-CEVAP SETİ',
      room: {
        roomTitle: {
          label: 'Oda başlığı',
          placeholder: 'Oda başlığı yaz'
        },
        isListed: {
          label: 'Açık odalarda listensin mi?'
        },
        isAnon: {
          label: 'Oluşturan oyuncu adın gizlensin mi?'
        }
      },
      qa: {
        empty: {
          description: 'Soru-cevap setin şu anda boş',
          action: 'Soru ekle'
        },
        question: {
          label: 'Soru',
          placeholder: 'Soruyu yaz'
        },
        answer: {
          label: 'Cevap',
          placeholder: 'Cevapları virgül ile ayırabilirsin',
          error: {
            nonMatched: 'Her cevap aynı karakterle başlamalı'
          }
        },
        character: {
          label: 'Karakter',
          placeholder: 'Soru karakteri'
        },
        addMoreQuestion: 'Başka soru ekle'
      },
      saveDraft: {
        action: 'Taslak kaydet',
        callback: {
          success: 'Sonrası için kaydediliyor, geri döndüğünde aynı form olacak'
        }
      },
      deleteDraft: {
        action: 'Kayıtlı formu temizle',
        confirm: {
          title: 'Emin misin?',
          description: 'Formu temizliyorsun şu anda formda gördüklerin silinecek',
          confirm: 'Temizle',
          cancel: 'Vazgeç'
        },
        callback: {
          success: 'Kayıtlı form temizlendi'
        }
      },
      termsDescription:
        '* Oda oluştururken spam, nefret söylemi içeren, ırkçı ve aşağılayacı içeriklerden kaçının. Bu gibi odalar moderasyon tespitinde silinecektir. Oda oluştururken IP adresiniz yasal mevzuat gereği saklanır. İhlal durumunda yasal yaptırım uygulanabilir.',
      submit: 'Bitir ve yayınla',
      error: {
        couldNotCreate: 'Oda oluşturulamadı, lütfen kontrol edip tekrar dene'
      }
    },
    roomReview: {
      back: 'Geri dön',
      comment: {
        placeholder: 'Yorumunu yaz'
      },
      submit: 'Gönder',
      empty: {
        rating: {
          description: 'Yorum yazmadan önce puan vermelisin'
        }
      },
      error: {
        emptyRating: 'Puan vermelisin',
        required: 'Bir şeyler yazmalısın',
        maxLength: 'Çok uzun yazmamalısın'
      }
    },
    usernameEdit: {
      usernameField: {
        placeholder: 'Oyuncu adını yaz'
      },
      submit: 'Kaydet',
      callback: {
        success: 'Oyuncu adın değiştirildi'
      },
      error: {
        submit: 'Bu oyuncu adı uygun değil lütfen başka yaz'
      }
    }
  },
  roomReviewList: {
    ratingTitle: 'Oda puanı',
    reviewsTitle: 'Yorumlar',
    empty: {
      description: 'Henüz kimse değerlendirme yapmadı',
      action: 'Yorum ekle'
    }
  },
  seo: {
    main: {
      title: 'parolla - Kelime oyunu',
      description: 'Günlük soruları çöz ve rekabete katıl. Kendi soru-cevap setini oluştur, oyuncuların oluşturduğu eğlenceli soruları çöz'
    }
  }
}
