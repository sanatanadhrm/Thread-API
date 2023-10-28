class GetComment {
  constructor (payload) {
    this._verifyPayload(payload)
    const { id, username, date, content, is_delete: isDelete, like_count: likeCount } = payload
    this.id = id
    this.username = username
    this.date = date
    this.isDelete = Number(isDelete)
    this.likeCount = likeCount
    this.content = isDelete === 0 ? content : '**komentar telah dihapus**'
  }

  _verifyPayload ({
    id, content, date, username, is_delete: isDelete
  }) {
    if (!id || !content || !date || !username) {
      throw new Error('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string') {
      throw new Error('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
module.exports = GetComment
