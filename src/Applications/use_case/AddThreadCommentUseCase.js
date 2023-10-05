const NewThreadComment = require('../../Domains/threadComments/entities/NewThreadComment')

class AddThreadCommentUseCase {
  constructor ({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCasePayload) {
    const newComment = new NewThreadComment(useCasePayload)
    await this._threadRepository.verifyThreadById(useCasePayload.threadId)
    return await this._threadCommentRepository.addThreadComment(newComment)
  }
}
module.exports = AddThreadCommentUseCase
