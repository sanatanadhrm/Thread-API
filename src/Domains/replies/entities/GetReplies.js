class GetReplies {
  constructor (payload) {
    this._verifyPayload(payload)
    const { id, username, date, content, is_delete: isDelete } = payload
    this.id = id
    this.username = username
    this.date = date
    this.content = isDelete === 0 ? content : '**balasan telah dihapus**'
  }

  _verifyPayload ({
    id, content, date, username, is_delete: isDelete
  }) {
    if (!id || !content || !date || !username) {
      throw new Error('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string') {
      throw new Error('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
module.exports = GetReplies
