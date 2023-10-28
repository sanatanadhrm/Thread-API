const NewLikeComment = require('../../Domains/likesComments/entities/NewLikeComment')

class LikeCommentUseCase {
  constructor ({ likeCommentRepository, threadCommentRepository }) {
    this._likeCommentRepository = likeCommentRepository
    this._threadCommentRepository = threadCommentRepository
  }

  async execute (useCasePayload) {
    const newLikeComment = new NewLikeComment(useCasePayload)
    const { commentId, userId, threadId } = newLikeComment
    await this._threadCommentRepository.verifyCommentAtThread(commentId, threadId)
    const verify = await this._likeCommentRepository.verifyLikeCommentByCommentId(commentId, userId)
    if (!verify) {
      await this._threadCommentRepository.addLikeComment(commentId)
      return this._likeCommentRepository.addLikeCommentByCommentId(newLikeComment)
    } else {
      await this._threadCommentRepository.reduceLikeComment(commentId)
      return this._likeCommentRepository.deleteLikeCommentByCommentId(commentId, userId)
    }
  }
}
module.exports = LikeCommentUseCase
