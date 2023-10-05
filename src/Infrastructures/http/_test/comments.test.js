const pool = require('../../database/postgres/pool')
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads/comments endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable()
    await ThreadTableTestHelper.cleanTable()
    await UserTableTestHelper.cleanTable()
    await AuthenticationTableTestHelper.cleanTable()
  })

  describe('when POST /comments', () => {
    it('should response 201 and new comment same user', async () => {
      // Arrange
      const server = await createServer(container)
      /** Add user */
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
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment.id).toBeDefined()
      expect(responseJson.data.addedComment.content).toBeDefined()
      expect(responseJson.data.addedComment.owner).toBeDefined()
    })
    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        content: ['sebuah comment']
      }
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
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai')
    })
    it('should response 400 when request payload not contain needed data properti', async () => {
      const requestPayload = {
      }
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
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('harus mengirimkan properti yang sesuai')
    })
    it('should response 401 if user doesnt authentications', async () => {
      const requestPayload = {
        content: 'sebuah comment',
        thread_id: 'thread-123',
        user_id: 'user-123'
      }
      const server = await createServer(container)
      const threadId = 'thread-234'
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 201 and new comment different user', async () => {
      const server = await createServer(container)

      const payloadUserTom = {
        username: 'Tom',
        password: 'secret',
        fullname: 'Tom tom'
      }
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserTom
      })
      const authTom = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: payloadUserTom.username,
          password: payloadUserTom.password
        }
      })
      const responseAuthTom = JSON.parse(authTom.payload)
      const { accessToken: accessTokenTom } = responseAuthTom.data

      const responseThreadTom = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread'
        },
        headers: {
          Authorization: `Bearer ${accessTokenTom}`
        }
      })
      const responseThread = JSON.parse(responseThreadTom.payload)
      const { addedThread } = responseThread.data

      const payloadUserJerry = {
        username: 'jerry',
        password: 'secret',
        fullname: 'jery jery'
      }
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserJerry
      })
      const authJerry = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: payloadUserJerry.username,
          password: payloadUserJerry.password
        }
      })
      const responseAuthJerry = JSON.parse(authJerry.payload)
      const { accessToken } = responseAuthJerry.data
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
      const responseCommentJson = JSON.parse(responseComment.payload)
      expect(responseComment.statusCode).toEqual(201)
      expect(responseCommentJson.status).toEqual('success')
      expect(responseCommentJson.data.addedComment.id).toBeDefined()
      expect(responseCommentJson.data.addedComment.content).toBeDefined()
      expect(responseCommentJson.data.addedComment.owner).toBeDefined()
    })

    it('should response 404 when request comment at not available thread', async () => {
      const server = await createServer(container)

      const payloadUserTom = {
        username: 'Tom',
        password: 'secret',
        fullname: 'Tom tom'
      }
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserTom
      })
      const authTom = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: payloadUserTom.username,
          password: payloadUserTom.password
        }
      })
      const responseAuthTom = JSON.parse(authTom.payload)
      const { accessToken: accessTokenTom } = responseAuthTom.data
      const fakeId = 'fakeThreadId-123'
      const requestPayload = {
        content: 'sebuah comment'
      }
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${fakeId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessTokenTom}`
        }
      })
      const responseCommentJson = JSON.parse(responseComment.payload)
      expect(responseComment.statusCode).toEqual(404)
      expect(responseCommentJson.status).toEqual('fail')
      expect(responseCommentJson.message).toEqual('thread tidak ditemukan')
    })
  })
  describe('when DELETE /comments', () => {
    it('should response 200 if parameter valid and delete comment', async () => {
      const server = await createServer(container)
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname'
      }
      const requestPayloadThread = {
        title: 'A title',
        body: 'A body'
      }
      const requestPayload = {
        content: 'A content'
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
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonThread = JSON.parse(responseThreads.payload)
      const { addedThread } = responseJsonThread.data
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseCommentJson = JSON.parse(responseComment.payload)
      const { addedComment } = responseCommentJson.data

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
    it('should response 404 if comment does mot exist', async () => {
      const server = await createServer(container)
      const requestPayloadUser = {
        username: 'username',
        password: 'password',
        fullname: 'A Fullname'
      }
      const requestPayloadThread = {
        title: 'A title',
        body: 'A body'
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
        payload: requestPayloadThread,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJsonThread = JSON.parse(responseThreads.payload)
      const { addedThread } = responseJsonThread.data
      const fakeCommentId = 'fakeComment-123'
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${fakeCommentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Comment tidak ditemukan')
    })
    it('should response 403 error when the user does not have access to the resource', async () => {
      const server = await createServer(container)

      const payloadUserTom = {
        username: 'Tom',
        password: 'secret',
        fullname: 'Tom tom'
      }
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserTom
      })
      const authTom = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: payloadUserTom.username,
          password: payloadUserTom.password
        }
      })
      const responseAuthTom = JSON.parse(authTom.payload)
      const { accessToken: accessTokenTom } = responseAuthTom.data

      const responseThreadTom = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread'
        },
        headers: {
          Authorization: `Bearer ${accessTokenTom}`
        }
      })
      const responseThread = JSON.parse(responseThreadTom.payload)
      const { addedThread } = responseThread.data

      const payloadUserJerry = {
        username: 'jerry',
        password: 'secret',
        fullname: 'jery jery'
      }
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: payloadUserJerry
      })
      const authJerry = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: payloadUserJerry.username,
          password: payloadUserJerry.password
        }
      })
      const responseAuthJerry = JSON.parse(authJerry.payload)
      const { accessToken: accessTokenJerry } = responseAuthJerry.data
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: {
          content: 'sebuah comment'
        },
        headers: {
          Authorization: `Bearer ${accessTokenJerry}`
        }
      })
      const responseCommentJson = JSON.parse(responseComment.payload)
      const { addedComment } = responseCommentJson.data
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessTokenTom}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('anda tidak memiliki akses ke sumber')
    })
  })
})
