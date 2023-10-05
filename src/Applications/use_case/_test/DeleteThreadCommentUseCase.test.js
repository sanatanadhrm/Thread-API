const DeleteThreadCommentUseCase = require('../DeleteThreadCommenUseCase')
const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository')

describe('DeleteThreadCommentUseCas', () => {
  it('should orchesting the delete ThreadComment action correctly', async () => {
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }

    const useCaseUser = {
      userId: 'user-123'
    }

    const mockCommentRepository = new ThreadCommentRepository()

    mockCommentRepository.verifyCommentAtThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyCommentAccess = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteThreadCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const getCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockCommentRepository
    })

    await getCommentUseCase.execute(useCaseParams, useCaseUser.userId)

    expect(mockCommentRepository.verifyCommentAtThread).toBeCalledWith(useCaseParams.commentId, useCaseParams.threadId)
    expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith(useCaseParams.commentId, useCaseUser.userId)
    expect(mockCommentRepository.deleteThreadCommentById).toBeCalledWith(useCaseParams.commentId)
  })
})
