const pool = require('../../database/postgres/pool')
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper')
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper')
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')

describe('/users endpoint', () => {
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
    it('should response 201 and persist comment with same user', async () => {
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
      console.log(responseJson)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment).toBeDefined()
    })
  })
})
