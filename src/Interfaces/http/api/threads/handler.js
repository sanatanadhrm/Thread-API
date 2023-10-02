const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this)
  }

  async postThreadHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
    const addedThread = await addThreadUseCase.execute({ ...request.payload, owner: credentialId })

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    })
    response.code(201)
    return response
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
}
module.exports = ThreadsHandler
