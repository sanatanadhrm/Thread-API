const LikesCommentRepository = require('../../Domains/likesComments/LikesCommentRepository')
const AddedLikeComment = require('../../Domains/likesComments/entities/AddedLikeComment')

class LikeCommentRepositoryPostgres extends LikesCommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addLikeCommentByCommentId (newLikeComment) {
    const { commentId, userId } = newLikeComment
    const id = `like-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id, comment_id, user_id',
      values: [id, commentId, userId]
    }
    const result = await this._pool.query(query)
    return new AddedLikeComment({ id: result.rows[0].id, commentId: result.rows[0].comment_id, userId: result.rows[0].user_id })
  }

  async deleteLikeCommentByCommentId (commentId, userId) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND user_id = $2 RETURNING id',
      values: [commentId, userId]
    }
    const result = await this._pool.query(query)
    return result.rows[0]
  }

  async verifyLikeCommentByCommentId (commentId, userId) {
    const query = {
      text: 'SELECT id FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId]
    }
    const result = await this._pool.query(query)
    return result.rows.length
  }
}
module.exports = LikeCommentRepositoryPostgres
