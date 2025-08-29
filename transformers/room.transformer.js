export default model => {
  return {
    id: model.roomId,
    relationId: model.documentId,
    title: model.title,
    isListed: model.isPublic,
    isAnon: model.isAnon,
    questionCount: model.questionCount,
    viewCount: model.viewCount,
    reviewCount: model.reviewsCount,
    rating: model.rating,
    user: model.user,
    alphabet: model.alphabet,
    questions: model.qaList
  }
}
