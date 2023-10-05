class DeleteThreadCommentUseCase {
  constructor ({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository
  }

  async execute (useCaseParams, userId) {
    const { threadId, commentId } = useCaseParams
    await this._threadCommentRepository.verifyCommentAtThread(commentId, threadId)
    await this._threadCommentRepository.verifyCommentAccess(commentId, userId)
    return this._threadCommentRepository.deleteThreadCommentById(commentId)
  }
}
module.exports = DeleteThreadCommentUseCase
