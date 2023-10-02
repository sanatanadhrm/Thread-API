const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
// const InvariantError = require('../../../Commons/exceptions/InvariantError')
const pool = require('../../database/postgres/pool')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
  })
  afterAll(async () => {
    await pool.end()
  })

  describe('AddThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = () => '234' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
      const registered = await userRepositoryPostgres.addUser(registerUser)
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: registered.id
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      await threadRepositoryPostgres.addThread(newThread)

      const thread = await ThreadTableTestHelper.findThreadById('thread-234')
      expect(thread).toHaveLength(1)
    })
    it('should return added thread user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = () => '234' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
      const registered = await userRepositoryPostgres.addUser(registerUser)
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: registered.id
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)

      const addedThread = await threadRepositoryPostgres.addThread(newThread)

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-234',
        title: 'sebuah thread',
        owner: 'user-234'
      }))
    })
  })
})
