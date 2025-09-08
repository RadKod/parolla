import { userTransformer } from '@/transformers'

export default model => {
  return {
    rating: model.rating,
    comment: model.content,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    user: model.user ? userTransformer(model.user) : null
  }
}
