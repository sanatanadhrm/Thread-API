const AddRepliesUseCase = require('../AddRepliesUseCase')
const AddedReplies = require('../../../Domains/replies/entities/AddedReplies')
const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository')
const RepliesRepository = require('../../../Domains/replies/RepliesRepository')
const NewReplies = require('../../../Domains/replies/entities/NewReplies')

describe('PostRepliesUseCase', () => {
  it('should orchesting the post ThreadComment action correctly', async () => {
    const user = {
      id: 'user-123',
      username: 'username'
    }
    const useCaseParams = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    }

    const useCasePayload = {
      content: 'sebuah replies'
    }

    const mockaddReplies = {
      content: useCasePayload.content,
      commentId: useCaseParams.commentId,
      owner: user.id
    }

    const mockCommentRepository = new ThreadCommentRepository()
    const mockRepliesRepository = new RepliesRepository()

    mockCommentRepository.verifyCommentAtThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockRepliesRepository.addReplies = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReplies({
        id: 'replies-123',
        content: 'sebuah replies',
        owner: 'user-123'
      })))

    const getRepliesUseCas = new AddRepliesUseCase({
      threadCommentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository
    })

    const addedReplies = await getRepliesUseCas.execute(useCasePayload, useCaseParams, user.id)

    expect(addedReplies).toStrictEqual(new AddedReplies({
      id: 'replies-123',
      content: 'sebuah replies',
      owner: 'user-123'
    }))
    expect(mockCommentRepository.verifyCommentAtThread).toBeCalledWith(useCaseParams.commentId, useCaseParams.threadId)
    expect(mockRepliesRepository.addReplies).toBeCalledWith(new NewReplies(mockaddReplies))
  })
})
