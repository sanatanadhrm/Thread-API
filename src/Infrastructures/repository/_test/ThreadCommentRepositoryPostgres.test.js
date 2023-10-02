const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const pool = require('../../database/postgres/pool')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres')
const NewThreadComment = require('../../../Domains/threadComments/entities/NewThreadComment')
const AddedThreadComment = require('../../../Domains/threadComments/entities/AddedThreadComment')

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await CommentTableTestHelper.cleanTable()
  })
  afterAll(async () => {
    await pool.end()
  })
  describe('addThreadComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = () => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
      const registered = await userRepositoryPostgres.addUser(registerUser)
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: registered.id
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
      const addedthread = await threadRepositoryPostgres.addThread(newThread)

      const newComment = new NewThreadComment({
        threadId: addedthread.id,
        content: 'sebuah comment',
        owner: registered.id
      })
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)
      await threadCommentRepositoryPostgres.addThreadComment(newComment)
      const comment = await CommentTableTestHelper.findCommentById('comment-123')
      expect(comment).toHaveLength(1)
    })
    it('should return addedcomment user correctly', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      })
      const fakeIdGenerator = () => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
      const registered = await userRepositoryPostgres.addUser(registerUser)
      const newThread = new NewThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: registered.id
      })
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator)
      const addedthread = await threadRepositoryPostgres.addThread(newThread)

      const newComment = new NewThreadComment({
        threadId: addedthread.id,
        content: 'sebuah comment',
        owner: registered.id
      })
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator)
      const addedComment = await threadCommentRepositoryPostgres.addThreadComment(newComment)
      expect(addedComment).toStrictEqual(new AddedThreadComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123'
      }))
    })
  })
})
