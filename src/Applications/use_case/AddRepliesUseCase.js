const NewReplies = require('../../Domains/replies/entities/NewReplies')

class AddRepliesUseCase {
  constructor ({ threadCommentRepository, repliesRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._repliesRepository = repliesRepository
  }

  async execute (useCasePayload, useCaseParams, userId) {
    const { threadId, commentId } = useCaseParams
    await this._threadCommentRepository.verifyCommentAtThread(commentId, threadId)
    const newReply = new NewReplies({
      ...useCasePayload, commentId, owner: userId
    })
    return this._repliesRepository.addReplies(newReply)
  }
}
module.exports = AddRepliesUseCase
