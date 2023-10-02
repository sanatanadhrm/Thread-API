class NewThreadComment {
  constructor (payload) {
    this._verifyPayload(payload)

    const { threadId, content, owner } = payload
    this.content = content
    this.threadId = threadId
    this.owner = owner
  }

  _verifyPayload ({ threadId, content, owner }) {
    if (!threadId || !content || !owner) {
      throw new Error('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
module.exports = NewThreadComment
