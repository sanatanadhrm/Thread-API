const pool = require('../../database/postgres/pool')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NewLikeComment = require('../../../Domains/likesComments/entities/NewLikeComment')
const AddedLikeComment = require('../../../Domains/likesComments/entities/AddedLikeComment')
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres')

describe('LikeCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await CommentTableTestHelper.cleanTable()
    await LikesTableTestHelper.cleanTable()
  })
  afterAll(async () => {
    await pool.end()
  })

  describe('addLikeComment function', () => {
    it('should persist add like comment and return added like comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      const fakeIdGenerator = () => '123'
      const newLikeComment = new NewLikeComment({
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123'
      })
      const likeCommentRepository = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator)
      const addedLikeComment = await likeCommentRepository.addLikeCommentByCommentId(newLikeComment)
      expect(addedLikeComment).toStrictEqual(new AddedLikeComment({
        id: 'like-123',
        commentId: 'comment-123',
        userId: 'user-123'
      }))
    })
    it('should add like comment to database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      const fakeIdGenerator = () => '123'
      const newLikeComment = new NewLikeComment({
        commentId: 'comment-123',
        userId: 'user-123',
        threadId: 'thread-123'
      })
      const likeCommentRepository = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator)
      await likeCommentRepository.addLikeCommentByCommentId(newLikeComment)
      const likeComment = await LikesTableTestHelper.findLikeCommentById('like-123')
      expect(likeComment).toHaveLength(1)
    })
  })
  describe('deleteLikeComment function', () => {
    it('should delete like comment from database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await ThreadTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' })
      await CommentTableTestHelper.addThreadComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' })
      await LikesTableTestHelper.addLikeCommentByCommentId({ id: 'like-123', commentId: 'comment-123', userId: 'user-123' })

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {})
      await likeCommentRepositoryPostgres.deleteLikeCommentByCommentId('comment-123', 'user-123')
      const likeComment = await LikesTableTestHelper.findLikeCommentById('like-123')
      expect(likeComment).toHaveLength(0)
    })
  })
  describe('verifyLikeComment function', () => {
    it('should return empty array when like comment not found', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {})
      const likeComment = await likeCommentRepositoryPostgres.verifyLikeCommentByCommentId('comment-123', 'user-123')
      expect(likeComment).toStrictEqual(0)
    })
  })
})
