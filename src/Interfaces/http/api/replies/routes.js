const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postRepliesHandler,
    options: {
      auth: 'forum_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{repliesId}',
    handler: handler.deleteRepliesHandler,
    options: {
      auth: 'forum_jwt'
    }
  }
])
module.exports = routes
