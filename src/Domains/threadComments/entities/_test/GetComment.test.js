const GetComment = require('../GetComment')

describe('a getComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'sanatana'
    }
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'sebuah comment',
      username: 'sanatana',
      date: ['2023-09-22'],
      is_delete: true
    }
    expect(() => new GetComment(payload)).toThrowError('GET_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })
  it('should create GetThreadComment object correctly', async () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      date: '2023-09-22',
      username: 'sanatana',
      is_delete: 0
    }
    const payload2 = {
      id: 'comment-123',
      content: '***comment dihapus***',
      date: '2023-09-22',
      username: 'sanatana',
      is_delete: 1
    }
    // Action
    const {
      id, content, date, username
    } = new GetComment(payload)
    const getpayload2 = new GetComment(payload2)
    // Assert
    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(date).toEqual(payload.date)
    expect(username).toEqual(payload.username)
    expect(getpayload2.content).toEqual(payload2.content)
  })
})
