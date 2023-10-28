const NewReplies = require('../NewReplies')

describe('a Replies Comment Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah replies'
    }
    expect(() => new NewReplies(payload)).toThrowError('NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
  })
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: ['sebuah replies'],
      commentId: true,
      owner: {}
    }
    expect(() => new NewReplies(payload)).toThrowError('NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 'sebuah replies',
      commentId: 'comment-123',
      owner: 'user-123'
    }

    const newReplies = new NewReplies(payload)

    expect(newReplies.content).toEqual(payload.content)
    expect(newReplies.commentId).toEqual(payload.commentId)
    expect(newReplies.owner).toEqual(payload.owner)
  })
})
