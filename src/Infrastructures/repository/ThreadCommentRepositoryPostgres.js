const ThreadCommentRepository = require('../../Domains/threadComments/ThreadCommentRepository')
const AddedThreadComment = require('../../Domains/threadComments/entities/AddedThreadComment')

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThreadComment (newComment) {
    const { content, threadId, owner } = newComment
    const id = `comment-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO comments (id, content, thread_id, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, owner]
    }
    const result = await this._pool.query(query)
    return new AddedThreadComment({ ...result.rows[0], threadId })
  }
}
module.exports = ThreadCommentRepositoryPostgres
