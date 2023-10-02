const AddedThreadComment = require('../../../Domains/threadComments/entities/AddedThreadComment')
const NewThreadComment = require('../../../Domains/threadComments/entities/NewThreadComment')
const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository')
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('PostThreadCommentUseCas', () => {
  it('should orchesting the post ThreadComment action correctly', async () => {
    const user = {
      id: 'user-123',
      username: 'username'
    }
    const thread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread'
    }
    const useCasePayload = {
      content: 'sebuah comment',
      threadId: thread.id,
      owner: user.id
    }

    const mockAddedComment = new AddedThreadComment({
      id: 'comment-123',
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123'
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new ThreadCommentRepository()

    mockThreadRepository.verifyThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.addThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment))

    const getCommentUseCae = new AddThreadCommentUseCase({
      threadCommentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    const addedComment = await getCommentUseCae.execute(useCasePayload)

    expect(addedComment).toStrictEqual(new AddedThreadComment({
      id: 'comment-123',
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123'
    }))

    expect(mockThreadRepository.verifyThreadById).toBeCalledWith(thread.id)
    expect(mockCommentRepository.addThreadComment).toBeCalledWith(new NewThreadComment(useCasePayload))
  })
})
