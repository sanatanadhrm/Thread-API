const AddedLikeComment = require('../AddedLikeComment')

describe('a AddedLikeComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      commentId: 'comment-123'
    }
    expect(() => new AddedLikeComment(payload)).toThrowError('ADDED_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      commentId: 123,
      userId: 123
    }
    expect(() => new AddedLikeComment(payload)).toThrowError('ADDED_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })
  it('should create addedLikeComment object correctly', () => {
    const payload = {
      id: 'like-123',
      commentId: 'comment-123',
      userId: 'user-123'
    }
    const addedLikeComment = new AddedLikeComment(payload)
    expect(addedLikeComment.id).toEqual(payload.id)
    expect(addedLikeComment.commentId).toEqual(payload.commentId)
    expect(addedLikeComment.userId).toEqual(payload.userId)
  })
})
