const ThreadCommentRepository = require('../ThreadCommentRepository')

describe('threadCommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository()

    // Action and Assert
    await expect(threadCommentRepository.addThreadComment({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.deleteThreadCommentById({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.verifyCommentAccess({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(threadCommentRepository.verifyCommentAtThread({})).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})