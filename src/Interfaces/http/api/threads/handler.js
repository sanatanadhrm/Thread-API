const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase')
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.postThreadHandler = this.postThreadHandler.bind(this)
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this)
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

  async getDetailThreadHandler (request, h) {
    const getDetailThread = this._container.getInstance(GetDetailThreadUseCase.name)
    const Thread = await getDetailThread.execute(request.params)
    const response = h.response({
      status: 'success',
      data: Thread
    })
    response.code(200)
    return response
  }
}
module.exports = ThreadsHandler
