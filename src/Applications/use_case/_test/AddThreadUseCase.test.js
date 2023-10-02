const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('PostThreadUseCase', () => {
  it('should orchestrating the post Thread action correctly', async () => {
    const user = {
      id: 'user-123',
      username: 'username'
    }
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: user.id
    }

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123'
    })

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread))

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    const addedThread = await getThreadUseCase.execute(useCasePayload)

    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner
    }))

    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload))
  })
})
