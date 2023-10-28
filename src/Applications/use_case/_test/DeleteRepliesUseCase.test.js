const DeleteRepliesUseCase = require('../DeleteRepliesUseCase')
const RepliesRepository = require('../../../Domains/replies/RepliesRepository')
const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository')

describe('DeleteRepliesUseCase', () => {
  it('should orchestrating the delete replies action correctly', async () => {
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      repliesId: 'reply-123'
    }

    const useCaseUser = {
      userId: 'user-123'
    }

    const mockRepliesRepository = new RepliesRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()

    mockThreadCommentRepository.verifyCommentAtThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockRepliesRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockRepliesRepository.verifyReplyAtComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockRepliesRepository.deleteRepliesById = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      repliesRepository: mockRepliesRepository,
      threadCommentRepository: mockThreadCommentRepository
    })
    await deleteRepliesUseCase.execute(useCaseParams, useCaseUser.userId)
    expect(mockThreadCommentRepository.verifyCommentAtThread).toBeCalledWith(useCaseParams.commentId, useCaseParams.threadId)
    expect(mockRepliesRepository.verifyReplyOwner).toBeCalledWith(useCaseParams.repliesId, useCaseUser.userId)
    expect(mockRepliesRepository.deleteRepliesById).toBeCalledWith(useCaseParams.repliesId)
    expect(mockRepliesRepository.verifyReplyAtComment).toBeCalledWith(useCaseParams.commentId, useCaseParams.repliesId)
  })
})
