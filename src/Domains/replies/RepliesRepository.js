class RepliesRepository {
  async addReplies (newReplies) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getRepliesByCommentId (commentId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteRepliesById (repliesId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyReplyAtComment (commentId, repliesId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyReplyOwner (repliesId, owner) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}
module.exports = RepliesRepository
