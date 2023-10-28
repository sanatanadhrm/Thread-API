class DeleteRepliesUseCase {
  constructor ({ threadCommentRepository, repliesRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._repliesRepository = repliesRepository
  }

  async execute (useCaseParams, userId) {
    const { threadId, commentId, repliesId } = useCaseParams
    await this._threadCommentRepository.verifyCommentAtThread(commentId, threadId)
    await this._repliesRepository.verifyReplyAtComment(commentId, repliesId)
    await this._repliesRepository.verifyReplyOwner(repliesId, userId)
    return this._repliesRepository.deleteRepliesById(repliesId)
  }
}
module.exports = DeleteRepliesUseCase
