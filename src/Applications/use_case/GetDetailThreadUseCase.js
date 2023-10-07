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
    comment = comment.map((comment) => {
      const res = new GetComment(comment)
      const { id, content, username, date } = res
      return { id, content, username, date }
    })
    // Combine thread and comment into the desired output format
    const result = {
      ...thread,
      comments: comment
    }

    console.log(result)
    return result
  }
}
module.exports = GetDetailThreadUseCae
