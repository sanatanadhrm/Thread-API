class GetDetailThread {
  constructor (payload) {
    this._verifyPayload(payload)
    const { id, title, body, username, date } = payload
    this._id = id
    this._title = title
    this._body = body
    this._username = username
    this._date = date
  }

  _verifyPayload ({ id, title, body, username, date }) {
    if (!id || !title || !username || !body || !date) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string' || typeof date !== 'string') {
      throw new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
module.exports = GetDetailThread
