import { userTransformer } from '@/transformers'

export default model => {
  return {
    roomRelationId: model.room_id,
    rating: model.rating,
    comment: model.content,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
    user: model.user ? userTransformer(model.user) : null
  }
}
