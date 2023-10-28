const AddedReplies = require('../AddedReplies')

describe('a Replies Comment Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'replies-123'
    }
    expect(() => new AddedReplies(payload)).toThrowError('ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
  })
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: ['replies-123'],
      content: true,
      owner: {}
    }
    expect(() => new AddedReplies(payload)).toThrowError('ADDED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'replies-123',
      content: 'comment-123',
      owner: 'user-123'
    }

    const addedReplies = new AddedReplies(payload)

    expect(addedReplies.id).toEqual(payload.id)
    expect(addedReplies.content).toEqual(payload.content)
    expect(addedReplies.owner).toEqual(payload.owner)
  })
})
