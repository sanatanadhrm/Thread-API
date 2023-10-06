const GetDetailThreadUseCae = require('../GetDetailThreadUseCase')
const GetComment = require('../../../Domains/threadComments/entities/GetComment')
const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread')
const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')

describe('GetDetailThreadUseCase', () => {
  it('should orchesting the get Detail Thread with comment action correctly', async () => {
    const user = {
      id: 'user-123',
      username: 'username'
    }
    const useCaseParams = {
      threadId: 'thread-123'
    }

    const expectThread = new GetDetailThread({
      id: useCaseParams.threadId,
      title: 'sebuah title',
      body: 'sebuah body',
      date: '2023-09-22',
      username: user.username
    })

    let detailComment = [
      {
        id: 'comment-123',
        username: user.username,
        date: '2023',
        content: 'comment_content',
        is_delete: 0
      }
    ]
    detailComment = detailComment.map((comment) => new GetComment(comment))
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new ThreadCommentRepository()

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: useCaseParams.threadId,
        title: 'sebuah title',
        body: 'sebuah body',
        date: '2023-09-22',
        username: user.username
      }))
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [{
          id: 'comment-123',
          content: 'comment_content',
          date: '2023',
          username: user.username,
          is_delete: 0
        }])
      )

    const getDetailThreadUseCase = new GetDetailThreadUseCae({
      threadCommentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    })

    const getResult = await getDetailThreadUseCase.execute(useCaseParams)
    console.log({ ...expectThread, comments: detailComment })

    expect(getResult).toEqual({ ...expectThread, comments: detailComment })
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId)
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId)
  })
})
