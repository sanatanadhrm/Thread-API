const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const pool = require('../../database/postgres/pool')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres')
const NewReplies = require('../../../Domains/replies/entities/NewReplies')
const AddedReplies = require('../../../Domains/replies/entities/AddedReplies')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await CommentTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })
  afterAll(async () => {
    await pool.end()
  })

  describe('addReplies function', () => {
    it('should presist add replies and return added replies correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      const fakeIdGenerator = () => '123'
      const newReplies = new NewReplies({
        content: 'sebuah replies',
        commentId: 'comment-123',
        owner: 'user-123'
      })
      const repliesRepository = new RepliesRepositoryPostgres(pool, fakeIdGenerator)
      const addedReplies = await repliesRepository.addReplies(newReplies)
      expect(addedReplies).toStrictEqual(new AddedReplies({
        id: 'replies-123',
        content: 'sebuah replies',
        owner: 'user-123'
      }))
    })
    it('should add replies to database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      const fakeIdGenerator = () => '123'
      const newReplies = new NewReplies({
        content: 'sebuah replies',
        commentId: 'comment-123',
        owner: 'user-123'
      })
      const repliesRepository = new RepliesRepositoryPostgres(pool, fakeIdGenerator)
      await repliesRepository.addReplies(newReplies)
      const Replies = await RepliesTableTestHelper.findRepliesById('replies-123')
      expect(Replies).toHaveLength(1)
    })
  })
  describe('check  owner Replies function', () => {
    it('should throw AuthorizationError when replies not owned by user', async () => {
      const repliesRepository = new RepliesRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })

      await expect(repliesRepository.verifyReplyOwner('replies-123', 'user-321')).rejects.toThrowError(AuthorizationError)
    })
    it('should not throw AuthorizationError when replies owned by user', async () => {
      const repliesRepository = new RepliesRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      await RepliesTableTestHelper.addReplies({ id: 'replies-123', commentId: 'comment-123', owner: 'user-123' })

      await expect(repliesRepository.verifyReplyOwner('replies-123', 'user-123')).resolves.not.toThrowError(AuthorizationError)
    })
  })
  describe('check  replies at comment function', () => {
    it('should throw NotFoundError when replies not at comment', async () => {
      const repliesRepository = new RepliesRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })

      await expect(repliesRepository.verifyReplyAtComment('comment-123', 'replies-321')).rejects.toThrowError(NotFoundError)
    })
    it('should not throw NotFoundError when replies at comment', async () => {
      const repliesRepository = new RepliesRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      await RepliesTableTestHelper.addReplies({ id: 'replies-123', commentId: 'comment-123', owner: 'user-123' })

      await expect(repliesRepository.verifyReplyAtComment('comment-123', 'replies-123')).resolves.not.toThrowError(NotFoundError)
    })
  })
  describe('deleteRepliesById function', () => {
    it('should delete replies from database', async () => {
      const repliesRepository = new RepliesRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      await RepliesTableTestHelper.addReplies({ id: 'replies-123', commentId: 'comment-123', owner: 'user-123' })

      await repliesRepository.deleteRepliesById('replies-123')
      const replies = await RepliesTableTestHelper.findRepliesById('replies-123')
      expect(replies[0].is_delete).toEqual(1)
    })
  })
  describe('getRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      const repliesRepository = new RepliesRepositoryPostgres(pool, {})
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      await RepliesTableTestHelper.addReplies({ id: 'replies-123', commentId: 'comment-123', owner: 'user-123' })
      await RepliesTableTestHelper.addReplies({ id: 'replies-124', commentId: 'comment-123', owner: 'user-123' })

      const replies = await repliesRepository.getRepliesByCommentId('comment-123')
      expect(replies).toHaveLength(2)
    })
  })
})
