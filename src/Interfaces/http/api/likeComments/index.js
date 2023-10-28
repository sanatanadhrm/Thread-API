const LikeCommentHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'likes',
  register: async (server, { container }) => {
    const likeCommentHandler = new LikeCommentHandler(container)
    server.route(routes(likeCommentHandler))
  }
}
