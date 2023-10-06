const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread (newThread) {
    const { title, body, owner } = newThread
    const id = `thread-${this._idGenerator()}`

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner]
    }

    const result = await this._pool.query(query)

    return new AddedThread({ ...result.rows[0], body })
  }

  async verifyThreadById (threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }
  }

  async getThreadById (threadId) {
    const query = {
      text: `SELECT a.id, a.title, a.body, a.date,
      b.username FROM threads AS a JOIN users AS b 
      ON (a.owner = b.id) WHERE a.id = $1`,
      values: [threadId]
    }
    const result = await this._pool.query(query)
    return { ...result.rows[0], date: result.rows[0].date.toString() }
  }
}

module.exports = ThreadRepositoryPostgres
