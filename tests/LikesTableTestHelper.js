const pool = require('../src/Infrastructures/database/postgres/pool')

const LikesTableTestHelper = {
  async cleanTable () {
    await pool.query('DELETE FROM likes WHERE 1=1')
  },

  async addLikeCommentByCommentId ({ id, commentId, userId }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, userId]
    }
    await pool.query(query)
  },

  async findLikeCommentById (id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id]
    }
    const result = await pool.query(query)
    return result.rows
  }
}

module.exports = LikesTableTestHelper
