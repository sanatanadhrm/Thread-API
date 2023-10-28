const AddedLikeComment = require('../../../Domains/likesComments/entities/AddedLikeComment')
const NewLikeComment = require('../../../Domains/likesComments/entities/NewLikeComment')
const LikeCommentRepository = require('../../../Domains/likesComments/LikesCommentRepository')
const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository')
const LikeCommentUseCase = require('../LikeCommentUseCase')

describe('LikeCommentUseCase', () => {
  it('should orchestrating the add like comment action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123'
    }
    const mockAddedLikeComment = new AddedLikeComment({
      id: 'like-123',
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId
    })
    const mockLikeCommentRepository = new LikeCommentRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()
    mockLikeCommentRepository.verifyLikeCommentByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadCommentRepository.verifyCommentAtThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockLikeCommentRepository.addLikeCommentByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedLikeComment))
    mockThreadCommentRepository.addLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const likeCommentUseCase = new LikeCommentUseCase({
      likeCommentRepository: mockLikeCommentRepository,
      threadCommentRepository: mockThreadCommentRepository
    })
    const addedLikeComment = await likeCommentUseCase.execute(useCasePayload)
    expect(addedLikeComment).toStrictEqual(new AddedLikeComment({
      id: 'like-123',
      commentId: 'comment-123',
      userId: 'user-123'
    }))
    expect(mockLikeCommentRepository.verifyLikeCommentByCommentId).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId)
    expect(mockLikeCommentRepository.addLikeCommentByCommentId).toBeCalledWith(new NewLikeComment(useCasePayload))
    expect(mockThreadCommentRepository.addLikeComment).toBeCalledWith(useCasePayload.commentId)
    expect(mockThreadCommentRepository.verifyCommentAtThread).toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId)
  })

  it('should orchestrating the delete like comment action correctly', async () => {
    const useCaseParams = {
      commentId: 'comment-123',
      threadId: 'thread-123'
    }
    const useCaseUser = {
      userId: 'user-123'
    }
    const mockLikeCommentRepository = new LikeCommentRepository()
    const mockThreadCommentRepository = new ThreadCommentRepository()
    mockThreadCommentRepository.verifyCommentAtThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockLikeCommentRepository.verifyLikeCommentByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'like-123'
      }))
    mockLikeCommentRepository.deleteLikeCommentByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadCommentRepository.reduceLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const likeCommentUseCase = new LikeCommentUseCase({
      likeCommentRepository: mockLikeCommentRepository,
      threadCommentRepository: mockThreadCommentRepository
    })
    const useCasePayload = {
      commentId: useCaseParams.commentId,
      userId: useCaseUser.userId,
      threadId: useCaseParams.threadId
    }
    await likeCommentUseCase.execute(useCasePayload)
    expect(mockLikeCommentRepository.verifyLikeCommentByCommentId).toBeCalledWith(useCaseParams.commentId, useCaseUser.userId)
    expect(mockThreadCommentRepository.verifyCommentAtThread).toBeCalledWith(useCaseParams.commentId, useCaseParams.threadId)
    expect(mockLikeCommentRepository.deleteLikeCommentByCommentId).toBeCalledWith(useCaseParams.commentId, useCaseUser.userId)
    expect(mockThreadCommentRepository.reduceLikeComment).toBeCalledWith(useCaseParams.commentId)
  })
})
