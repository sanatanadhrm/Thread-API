const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const RepliesRepository = require('../../Domains/replies/RepliesRepository')
const AddedReplies = require('../../Domains/replies/entities/AddedReplies')
const GetReplies = require('../../Domains/replies/entities/GetReplies')

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReplies (newReplies) {
    const { content, commentId, owner } = newReplies
    const id = `replies-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, commentId, owner]
    }
    const result = await this._pool.query(query)
    return new AddedReplies({ ...result.rows[0] })
  }

  async deleteRepliesById (repliesId) {
    const query = {
      text: 'UPDATE replies SET is_delete = 1 WHERE id = $1 RETURNING id',
      values: [repliesId]
    }
    const result = await this._pool.query(query)
    return result.rows[0]
  }

  async verifyReplyOwner (repliesId, userId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [repliesId, userId]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new AuthorizationError('anda tidak memiliki akses ke sumber')
    }
  }

  async verifyReplyAtComment (commentId, repliesId) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND comment_id = $2',
      values: [repliesId, commentId]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan')
    }
  }

  async getRepliesByCommentId (commentId) {
    const query = {
      text: 'SELECT a.*, b.username FROM replies AS a JOIN users AS b ON (a.owner = b.id) WHERE a.comment_id = $1 ORDER BY date',
      values: [commentId]
    }
    const result = await this._pool.query(query)
    return result.rows.map((row) => new GetReplies(row))
  }
}
module.exports = RepliesRepositoryPostgres
