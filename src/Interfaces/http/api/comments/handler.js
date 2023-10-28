const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase')
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommenUseCase')

class CommentsHandler {
  constructor (container) {
    this._container = container

    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this)
    this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this)
  }

  async postThreadCommentHandler (request, h) {
    const addCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name)
    const { id: credentialId } = request.auth.credentials
    const { threadId } = request.params
    const addedComment = await addCommentUseCase.execute({
      ...request.payload,
      threadId,
      owner: credentialId
    })

    const response = h.response({
      status: 'success',
      data: {
        addedComment
      }
    })
    response.code(201)
    return response
  }

  async deleteThreadCommentHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const deleteCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name)
    await deleteCommentUseCase.execute(request.params, credentialId)
    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}
module.exports = CommentsHandler
