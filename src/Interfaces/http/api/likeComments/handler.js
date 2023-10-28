const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase')

class LikeCommentHandler {
  constructor (container) {
    this._container = container
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this)
  }

  async putLikeCommentHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { commentId, threadId } = request.params
    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name)
    await likeCommentUseCase.execute({ commentId, threadId, userId: credentialId })
    return h.response({
      status: 'success'
    }).code(200)
  }
}
module.exports = LikeCommentHandler
