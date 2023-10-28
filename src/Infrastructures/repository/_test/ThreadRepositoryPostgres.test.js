const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
// const InvariantError = require('../../../Commons/exceptions/InvariantError')
const pool = require('../../database/postgres/pool')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const GetDetailThread = require('../../../Domains/threads/entities/GetDetailThread')

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
  describe('getDetailThreadById', () => {
    it('should return detail thread correctly', async () => {
      const fakeIdThread = 'thread-123'
      const threadPayload = {
        id: fakeIdThread,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123'
      }
      await UsersTableTestHelper.addUser({ id: threadPayload.owner, username: 'username' })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      await ThreadTableTestHelper.addThread(threadPayload)

      const getThread = await threadRepositoryPostgres.getThreadById(fakeIdThread)
      const dates = getThread.date
      expect(new GetDetailThread(getThread)).toStrictEqual(new GetDetailThread({
        body: 'sebuah body thread',
        date: dates,
        id: 'thread-123',
        title: 'sebuah thread',
        username: 'username'
      }))
    })
  })
  describe('verifyThreadById', () => {
    it('should throw NotFoundError when thread not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      await expect(threadRepositoryPostgres.verifyThreadById('thread-123')).rejects.toThrowError('thread tidak ditemukan')
    })
    it('should not throw NotFoundError when thread available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await expect(threadRepositoryPostgres.verifyThreadById('thread-123')).resolves.not.toThrowError('thread tidak ditemukan')
    })
  })
})
