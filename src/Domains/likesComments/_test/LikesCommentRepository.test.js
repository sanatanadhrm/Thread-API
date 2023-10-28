const LikesCommentsRepository = require('../LikesCommentRepository')

describe('LikesCommentsRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likesCommentsRepository = new LikesCommentsRepository()

    // Action and Assert
    await expect(likesCommentsRepository.addLikeCommentByCommentId({}, {})).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(likesCommentsRepository.deleteLikeCommentByCommentId({}, {})).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(likesCommentsRepository.verifyLikeCommentByCommentId({}, {})).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
