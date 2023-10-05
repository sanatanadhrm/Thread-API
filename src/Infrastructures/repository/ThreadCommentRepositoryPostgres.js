const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
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
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, owner]
    }
    const result = await this._pool.query(query)
    return new AddedThreadComment({ ...result.rows[0] })
  }

  async deleteThreadCommentById (commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = 1 WHERE id = $1 RETURNING id',
      values: [commentId]
    }
    const result = await this._pool.query(query)
    return result.rows[0]
  }

  async verifyCommentAtThread (commentId, threadId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId]
    }
    const result = await this._pool.query(query)

    if (result.rows.length === 0) {
      throw new NotFoundError('Comment tidak ditemukan')
    }
  }

  async verifyCommentAccess (commentId, userId) {
    console.log(userId, commentId)
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, userId]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak memiliki akses ke sumber')
    }
  }
}
module.exports = ThreadCommentRepositoryPostgres
