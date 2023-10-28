const pool = require('../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
  async cleanTable () {
    await pool.query('DELETE FROM replies WHERE 1=1')
  },

  async addReplies ({ id, content = 'sebuah Replies', commentId, owner, isDelete = 0 }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, commentId, owner, isDelete]
    }
    await pool.query(query)
  },

  async findRepliesById (id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  }
}
module.exports = RepliesTableTestHelper
