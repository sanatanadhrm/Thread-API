const pool = require('../../database/postgres/pool')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await UserTableTestHelper.cleanTable()
    await AuthenticationTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted replies', async () => {
      const server = await createServer(container)
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname'
      }
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser
      })
      /** Login user */
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password
        }
      })
      const responseJsonAuth = JSON.parse(responseAuths.payload)
      const { accessToken } = responseJsonAuth.data
      /** Add thread */
      const requestPayloadThread = {
        title: 'A title',
        body: 'A body'
      }
      const responseThreads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonThread = JSON.parse(responseThreads.payload)
      const { addedThread } = responseJsonThread.data
      /** Comment payload */
      const requestPayload = {
        content: 'A content'
      }

      // Action
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonComment = JSON.parse(responseComment.payload)
      const { addedComment } = responseJsonComment.data
      /** Replies payload */
      const repliesPayload = {
        content: 'sebuah replies'
      }
      const responseReplies = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: repliesPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonReplies = JSON.parse(responseReplies.payload)
      expect(responseJsonReplies.status).toBe('success')
      expect(responseReplies.statusCode).toBe(201)
      expect(responseJsonReplies.data.addedReply).toBeDefined()
      expect(responseJsonReplies.data.addedReply.id).toBeDefined()
      expect(responseJsonReplies.data.addedReply.content).toBeDefined()
      expect(responseJsonReplies.data.addedReply.owner).toBeDefined()
    })
    it('should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }
      })

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret'
        }
      })
      const responseAuth = JSON.parse(auth.payload)
      const { accessToken } = responseAuth.data

      const responseThreads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread'
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonThread = JSON.parse(responseThreads.payload)
      const { addedThread } = responseJsonThread.data
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment'
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonComment = JSON.parse(responseComment.payload)
      const { addedComment } = responseJsonComment.data
      const requestPayloadReplies = {
        content: ['sebuah replies']
      }
      const responseReplies = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayloadReplies,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonReplies = JSON.parse(responseReplies.payload)
      expect(responseReplies.statusCode).toBe(400)
      expect(responseJsonReplies.status).toBe('fail')
      expect(responseJsonReplies.message).toBe('tidak dapat membuat replies baru karena tipe data tidak sesuai')
    })
    it('should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia'
        }
      })

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret'
        }
      })
      const responseAuth = JSON.parse(auth.payload)
      const { accessToken } = responseAuth.data

      const responseThreads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread'
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonThread = JSON.parse(responseThreads.payload)
      const { addedThread } = responseJsonThread.data
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment'
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonComment = JSON.parse(responseComment.payload)
      const { addedComment } = responseJsonComment.data
      const requestPayloadReplies = {
      }
      const responseReplies = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayloadReplies,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonReplies = JSON.parse(responseReplies.payload)
      expect(responseReplies.statusCode).toBe(400)
      expect(responseJsonReplies.status).toBe('fail')
      expect(responseJsonReplies.message).toBe('harus mengirimkan properti yang sesuai')
    })
    it('should respose 401 when user not authentication', async () => {
      const resposePayload = {
        content: 'sebuah replies',
        comment_id: 'comment-123',
        user_id: 'user-123'
      }
      const server = await createServer(container)
      const threadId = 'thread-123'
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${resposePayload.comment_id}/replies`,
        payload: resposePayload
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toBe(401)
      expect(responseJson.error).toBe('Unauthorized')
      expect(responseJson.message).toBe('Missing authentication')
    })
  })
  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{repliesId}', () => {
    it('should response 200 and delete replies', async () => {
      const server = await createServer(container)
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname'
      }
      const requestPayloadThead = {
        title: 'A title',
        body: 'A body'
      }
      const requestPayloadComment = {
        content: 'A content'
      }
      const requestPayloadReplies = {
        content: 'sebuah replies'
      }
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayloadUser
      })
      const responseAuths = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: requestPayloadUser.username,
          password: requestPayloadUser.password
        }
      })
      const responseJsonAuth = JSON.parse(responseAuths.payload)
      const { accessToken } = responseJsonAuth.data
      const responseThreads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayloadThead,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonThread = JSON.parse(responseThreads.payload)
      const { addedThread } = responseJsonThread.data
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayloadComment,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonComment = JSON.parse(responseComment.payload)
      const { addedComment } = responseJsonComment.data
      const responseReplies = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies`,
        payload: requestPayloadReplies,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonReplies = JSON.parse(responseReplies.payload)
      const { addedReply } = responseJsonReplies.data
      const responseDeleteReplies = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}/replies/${addedReply.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonDeleteReplies = JSON.parse(responseDeleteReplies.payload)
      expect(responseDeleteReplies.statusCode).toBe(200)
      expect(responseJsonDeleteReplies.status).toBe('success')
    })
  })
})
