const pool = require('../../database/postgres/pool')
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await UserTableTestHelper.cleanTable()
    await AuthenticationTableTestHelper.cleanTable()
  })
  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 200 and liked comment', async () => {
      const server = await createServer(container)
      const requestPayloadUser = {
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia'
      }
      const requestPayloadThread = {
        title: 'sebuah thread',
        body: 'sebuah body thread'
      }
      const requestPayloadComment = {
        content: 'sebuah comment'
      }
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser
      })
      const responseAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayloadUser
      })
      const { data: { accessToken } } = JSON.parse(responseAuth.payload)
      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const { data: { addedThread } } = JSON.parse(responseThread.payload)
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const { data: { addedComment } } = JSON.parse(responseComment.payload)
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
