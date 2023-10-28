const GetComment = require('../../Domains/threadComments/entities/GetComment')
const GetDetailThread = require('../../Domains/threads/entities/GetDetailThread')
class GetDetailThreadUseCae {
  constructor ({ threadCommentRepository, threadRepository, repliesRepository }) {
    this._threadCommentRepository = threadCommentRepository
    this._threadRepository = threadRepository
    this._repliesRepository = repliesRepository
  }

  async execute (useCaseParams) {
    const { threadId } = useCaseParams
    const thread = new GetDetailThread(await this._threadRepository.getThreadById(threadId))
    let comment = await this._threadCommentRepository.getCommentByThreadId(threadId)
    let reply
    comment = await Promise.all(comment.map(async (comment) => {
      const { id, content, username, date, likeCount } = new GetComment(comment)
      reply = await this._repliesRepository.getRepliesByCommentId(id)
      return { id, content, username, date, likeCount, replies: reply }
    }))
    return { thread: { ...thread, comments: comment } }
  }
}
module.exports = GetDetailThreadUseCae
