const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentTableTestHelper = {
  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  },

  async addThreadComment ({ id, content = 'sebuah comment', threadId = 'thread-123', owner = 'user-123', isDelete = 0 }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, threadId, owner, isDelete]
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
