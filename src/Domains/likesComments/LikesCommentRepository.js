class LikesCommentsRepository {
  async addLikeCommentByCommentId (newLikeComment) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteLikeCommentByCommentId (commentId, userId) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyLikeCommentByCommentId (commentId, userId) {
    throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}
module.exports = LikesCommentsRepository
