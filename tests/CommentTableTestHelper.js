const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentTableTestHelper = {
  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
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
