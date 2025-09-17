export default model => {
  return {
    blocked: model.blocked,
    confirmed: model.confirmed,
    createdAt: model.createdAt,
    documentId: model.documentId,
    email: model.email,
    id: model.id,
    provider: model.provider,
    publishedAt: model.publishedAt,
    updatedAt: model.updatedAt,
    username: model.username,
    ...(model.tourScore && {
      tourScore: {
        daily: {
          score: model.tourScore.daily.score,
          rank: model.tourScore.daily.rank
        },
        weekly: {
          score: model.tourScore.weekly.score,
          rank: model.tourScore.weekly.rank
        },
        monthly: {
          score: model.tourScore.monthly.score,
          rank: model.tourScore.monthly.rank
        },
        allTime: {
          score: model.tourScore.allTime.score,
          rank: model.tourScore.allTime.rank
        }
      }
    })
  }
}
