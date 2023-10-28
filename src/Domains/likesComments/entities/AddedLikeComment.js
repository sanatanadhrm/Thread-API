class AddedLikeComment {
  constructor (payload) {
    this._verifyPayload(payload)
    const { id, commentId, userId } = payload
    this.id = id
    this.commentId = commentId
    this.userId = userId
  }

  _verifyPayload ({ id, commentId, userId }) {
    if (!id || !commentId || !userId) {
      throw new Error('ADDED_LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('ADDED_LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
module.exports = AddedLikeComment
