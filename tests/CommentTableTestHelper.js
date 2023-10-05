const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentTableTestHelper = {
  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  },

  async addThreadComment ({ id, content = 'sebuah comment', threadId = 'thread-123', owner = 'user-123' }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, owner]
    }
    await pool.query(query)
  },

  async findCommentById (id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  }
}
module.exports = CommentTableTestHelper
