const NewThreadComment = require('../NewThreadComment')

describe('a Thread Comment Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah comment'
    }
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: ['sebuah comment'],
      owner: {}
    }

    // Action and Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })
  it('should create NewThreadComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'therad-123',
      content: 'sebuah comment',
      owner: 'user-123'
    }

    // Action
    const { threadId, content, owner } = new NewThreadComment(payload)

    // Assert
    expect(threadId).toEqual(payload.threadId)
    expect(content).toEqual(payload.content)
    expect(owner).toEqual(payload.owner)
  })
})
