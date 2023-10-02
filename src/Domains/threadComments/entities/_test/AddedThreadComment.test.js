const AddedThreadComment = require('../AddedThreadComment')

describe('a AddedThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah comment',
      owner: 'user-123'
    }

    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'sebuah comment',
      owner: true
    }

    // Action and Assert
    expect(() => new AddedThreadComment(payload)).toThrowError('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create addedThreadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123'
    }

    // Action
    const addedThread = new AddedThreadComment(payload)

    // Assert
    expect(addedThread.id).toEqual(payload.id)
    expect(addedThread.content).toEqual(payload.content)
    expect(addedThread.owner).toEqual(payload.owner)
  })
})
