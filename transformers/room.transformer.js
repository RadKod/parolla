export default model => {
  return {
    id: model.room,
    relationId: model.id,
    title: model.title,
    isListed: model.is_public,
    isAnon: model.is_anon,
    questionCount: model.question_count,
    viewCount: model.view_count,
    reviewCount: model.review_count,
    rating: model.rating,
    user: model.user,
    alphabet: model.alphabet,
    questions: model.questions
  }
}
