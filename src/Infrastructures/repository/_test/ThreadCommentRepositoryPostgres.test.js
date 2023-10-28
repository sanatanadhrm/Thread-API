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
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const GetComment = require('../../../Domains/threadComments/entities/GetComment')

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
    it('should add comment to database', async () => {
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

  describe('checkAvailability function', () => {
    it('should throw NotFound Error if comment does not exist', async () => {
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})
      const commentId = 'comment-123'
      const userIdTom = 'user-123'
      const userIdJerry = 'user-234'
      const threadIdTom = 'thread-234' // different thread
      const threadIdJerry = 'thread-123'
      await UsersTableTestHelper.addUser({ id: userIdTom, username: 'Tom' })
      await UsersTableTestHelper.addUser({ id: userIdJerry, username: 'Jerry' })
      await ThreadTableTestHelper.addThread({ id: threadIdTom, owner: userIdTom })
      await ThreadTableTestHelper.addThread({ id: threadIdJerry, owner: userIdJerry })
      await CommentTableTestHelper.addThreadComment({ id: commentId, threadId: threadIdTom })

      await expect(threadCommentRepositoryPostgres.verifyCommentAtThread(commentId, threadIdJerry))
        .rejects.toThrow(NotFoundError)
    })
    it('sould not throw NotFound Error if comment exist', async () => {
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})
      const commentId = 'comment-123'
      const userIdTom = 'user-123'
      const threadIdTom = 'thread-234'
      await UsersTableTestHelper.addUser({ id: userIdTom, username: 'Tom' })
      await ThreadTableTestHelper.addThread({ id: threadIdTom, owner: userIdTom })
      await CommentTableTestHelper.addThreadComment({ id: commentId, threadId: threadIdTom })

      await expect(threadCommentRepositoryPostgres.verifyCommentAtThread(commentId, threadIdTom))
        .resolves.not.toThrow(NotFoundError)
    })
  })

  describe('check owner Comment', () => {
    it('sould not throw Error if comment owner valid', async () => {
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})
      const commentId = 'comment-123'
      const userIdTom = 'user-123'
      const threadIdTom = 'thread-234'
      await UsersTableTestHelper.addUser({ id: userIdTom, username: 'Tom' })
      await ThreadTableTestHelper.addThread({ id: threadIdTom, owner: userIdTom })
      await CommentTableTestHelper.addThreadComment({ id: commentId, threadId: threadIdTom, owner: userIdTom })

      await expect(threadCommentRepositoryPostgres.verifyCommentAccess(commentId, userIdTom))
        .resolves.not.toThrow(AuthorizationError)
    })
    it('sould not throw Error if comment owner valid', async () => {
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})
      const commentId = 'comment-123'
      const userIdTom = 'user-123'
      const userIdJerry = 'user-234' // different user
      const threadIdTom = 'thread-234'
      await UsersTableTestHelper.addUser({ id: userIdTom, username: 'Tom' })
      await ThreadTableTestHelper.addThread({ id: threadIdTom, owner: userIdTom })
      await CommentTableTestHelper.addThreadComment({ id: commentId, threadId: threadIdTom, owner: userIdTom })

      await expect(threadCommentRepositoryPostgres.verifyCommentAccess(commentId, userIdJerry))
        .rejects.toThrow(AuthorizationError)
    })
  })

  describe('deleteThreadComment function', () => {
    it('should soft delete comment from database', async () => {
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})
      const commentId = 'comment-123'
      const userId = 'user-123'
      const ThreadId = 'thread-123'
      await UsersTableTestHelper.addUser({ id: userId })
      await ThreadTableTestHelper.addThread({ id: ThreadId })
      await CommentTableTestHelper.addThreadComment({ id: commentId })

      await threadCommentRepositoryPostgres.deleteThreadCommentById(commentId)

      const comment = await CommentTableTestHelper.findCommentById(commentId)
      expect(comment[0].is_delete).toEqual(1)
    })
  })
  describe('getCommentByThreadId', () => {
    it('should return detail comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-234' })

      const commentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123')
      expect(comments).toHaveLength(2)
      expect(comments[0].id).toEqual('comment-123')
      expect(comments[0].content).toEqual('sebuah comment')
      expect(comments[0].username).toEqual('dicoding')
      expect(new GetComment(comments[0])).toStrictEqual(new GetComment({
        id: 'comment-123',
        content: 'sebuah comment',
        is_delete: 0,
        like_count: 0,
        username: 'dicoding',
        date: comments[0].date
      }))
    })
  })
  describe('addLikeComment function', () => {
    it('should add like to database', async () => {
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})
      const commentId = 'comment-123'
      const userId = 'user-123'
      const ThreadId = 'thread-123'
      await UsersTableTestHelper.addUser({ id: userId })
      await ThreadTableTestHelper.addThread({ id: ThreadId })
      await CommentTableTestHelper.addThreadComment({ id: commentId })

      await threadCommentRepositoryPostgres.addLikeComment(commentId, userId)

      const comment = await CommentTableTestHelper.findCommentById(commentId)
      expect(comment[0].like_count).toEqual(1)
    })
  })
  describe('reduceLikeComment function', () => {
    it('should reduce like to database', async () => {
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {})
      const commentId = 'comment-123'
      const userId = 'user-123'
      const ThreadId = 'thread-123'
      await UsersTableTestHelper.addUser({ id: userId })
      await ThreadTableTestHelper.addThread({ id: ThreadId })
      await CommentTableTestHelper.addThreadComment({ id: commentId })

      await threadCommentRepositoryPostgres.reduceLikeComment(commentId, userId)

      const comment = await CommentTableTestHelper.findCommentById(commentId)
      expect(comment[0].like_count).toEqual(-1)
    })
  })
})
