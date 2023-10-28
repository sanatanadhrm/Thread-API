const RepliesRepository = require('../RepliesRepository')

describe('repliesRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const repliesRepository = new RepliesRepository()

    // Action and Assert
    await expect(repliesRepository.addReplies({})).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(repliesRepository.getRepliesByCommentId({})).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(repliesRepository.deleteRepliesById({})).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(repliesRepository.verifyReplyOwner({})).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(repliesRepository.verifyReplyAtComment({})).rejects.toThrowError('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
