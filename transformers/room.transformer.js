export default model => {
  return {
    id: model.room,
    relationId: model.id,
    title: model.title,
    isPublic: model.is_public,
    viewCount: model.view_count,
    reviewCount: model.review_count,
    rating: model.rating,
    user: model.user,
    alphabet: model.alphabet,
    questions: model.questions
  }
}
