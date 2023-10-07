const pool = require('../../database/postgres/pool')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable()
    await UserTableTestHelper.cleanTable()
    await AuthenticationTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and new thread', async () => {
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread'
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
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread.id).toBeDefined()
      expect(responseJson.data.addedThread.title).toBeDefined()
      expect(responseJson.data.addedThread.owner).toBeDefined()
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        title: 'sebuah thread',
        body: ['sebuah body thread']
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

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai')
    })
    it('should response 400 when request payload not contain needed properti', async () => {
      const requestPayload = {
        title: 'sebuah thread'
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

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        title: 'sebuah thread',
        body: ['sebuah body thread']
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
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })
  })
  describe('when GET /threads/{threadId/', () => {
    it('should response 200 and get the thread and comments correctly', async () => {
      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'dicoding indonesia'
      }
      const threadPayload = {
        title: 'sebuah title',
        body: 'sebuah body'
      }
      const commentPayload1 = {
        content: 'sebuah comment-1'
      }
      const commentPayload2 = {
        content: 'sebuah comment-2'
      }
      const server = await createServer(container)

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload
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

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const threadJson = JSON.parse(thread.payload)
      const { addedThread } = threadJson.data
      console.log(addedThread.id)
      await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload1,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        payload: commentPayload2,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const commentJson = JSON.parse(comment.payload)
      const { addedComment } = commentJson.data
      await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`
      })
      const responseJson = JSON.parse(response.payload)
      console.log(typeof responseJson)
    })
  })
})
