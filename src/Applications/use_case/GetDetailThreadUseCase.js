const GetComment = require('../../Domains/threadComments/entities/GetComment')
const GetDetailThread = require('../../Domains/threads/entities/GetDetailThread')
class GetDetailThreadUseCae {
  constructor ({ threadCommentRepository, threadRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
  }

  async execute (useCaseParams) {
    const { threadId } = useCaseParams
    const thread = new GetDetailThread(await this._threadRepository.getThreadById(threadId))
    let comment = await this._threadCommentRepository.getCommentByThreadId(threadId)
    if (comment.length > 0) {
      comment = comment.map((comment) => new GetComment(comment))
    }
    // Combine thread and comment into the desired output format
    const result = {
      ...thread,
      comments: comment
    }

    console.log(result)
    return { ...thread, comments: comment }
  }
}
module.exports = GetDetailThreadUseCae
