const AddRepliesUseCase = require('../../../../Applications/use_case/AddRepliesUseCase')
const DeleteRepliesUseCase = require('../../../../Applications/use_case/DeleteRepliesUseCase')

class RepliesHandler {
  constructor (container) {
    this._container = container

    this.postRepliesHandler = this.postRepliesHandler.bind(this)
    this.deleteRepliesHandler = this.deleteRepliesHandler.bind(this)
  }

  async postRepliesHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const postReplies = this._container.getInstance(AddRepliesUseCase.name)
    const replies = await postReplies.execute(request.payload, request.params, credentialId)
    const response = h.response({
      status: 'success',
      data: {
        addedReply: replies
      }
    })
    response.code(201)
    return response
  }

  async deleteRepliesHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const deleteReplies = this._container.getInstance(DeleteRepliesUseCase.name)
    await deleteReplies.execute(request.params, credentialId)
    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}
module.exports = RepliesHandler
