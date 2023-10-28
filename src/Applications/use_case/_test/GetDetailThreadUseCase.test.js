const GetDetailThreadUseCae = require('../GetDetailThreadUseCase')
const GetComment = require('../../../Domains/threadComments/entities/GetComment')
const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread')
const ThreadCommentRepository = require('../../../Domains/threadComments/ThreadCommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const RepliesRepository = require('../../../Domains/replies/RepliesRepository')
const GetReplies = require('../../../Domains/replies/entities/GetReplies')

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
        is_delete: 0,
        like_count: 0
      },
      {
        id: 'comment-124',
        username: user.username,
        date: '2023',
        content: 'comment_content',
        is_delete: 1,
        like_count: 0
      }
    ]
    const detailReplies = [new GetReplies(
      {
        id: 'replies-123',
        username: user.username,
        date: '2023',
        content: 'replies_content',
        is_delete: 0
      }),
    new GetReplies(
      {
        id: 'replies-124',
        username: user.username,
        date: '2023',
        content: 'replies_content',
        is_delete: 1
      })
    ]

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new ThreadCommentRepository()
    const mockRepliesRepository = new RepliesRepository()
    detailComment = detailComment.map((detailComment) => {
      const { id, content, username, date, likeCount } = new GetComment(detailComment)

      return { id, content, username, date, likeCount, replies: detailReplies }
    })
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
          is_delete: 0,
          like_count: 0
        },
        {
          id: 'comment-124',
          content: 'comment_content',
          date: '2023',
          username: user.username,
          is_delete: 1,
          like_count: 0
        }])
      )
    mockRepliesRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(
        [new GetReplies({
          id: 'replies-123',
          content: 'replies_content',
          date: '2023',
          username: user.username,
          is_delete: 0
        }),
        new GetReplies({
          id: 'replies-124',
          content: 'replies_content',
          date: '2023',
          username: user.username,
          is_delete: 1
        })])
      )
    const getDetailThreadUseCase = new GetDetailThreadUseCae({
      threadCommentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      repliesRepository: mockRepliesRepository
    })

    const getResult = await getDetailThreadUseCase.execute(useCaseParams)
    const result = {
      thread: {
        ...expectThread,
        comments: detailComment
      }
    }
    expect(getResult).toEqual(result)
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseParams.threadId)
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId)
    expect(mockRepliesRepository.getRepliesByCommentId).toBeCalledWith(detailComment[1].id)
  })
})
