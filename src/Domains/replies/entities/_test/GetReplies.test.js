const GetReplies = require('../GetReplies')

describe('a getReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'Replies-123',
      username: 'sanatana'
    }
    expect(() => new GetReplies(payload)).toThrowError('GET_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
  })
  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'sebuah Replies',
      username: 'sanatana',
      date: ['2023-09-22'],
      is_delete: true
    }
    expect(() => new GetReplies(payload)).toThrowError('GET_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })
  it('should create GetThreadReplies object correctly', async () => {
    // Arrange
    const payload = {
      id: 'Replies-123',
      content: 'sebuah Replies',
      date: '2023-09-22',
      username: 'sanatana',
      is_delete: 0
    }
    const payload2 = {
      id: 'Replies-123',
      content: '**balasan telah dihapus**',
      date: '2023-09-22',
      username: 'sanatana',
      is_delete: 1
    }
    // Action
    const {
      id, content, date, username
    } = new GetReplies(payload)
    const getpayload2 = new GetReplies(payload2)
    // Assert
    expect(id).toEqual(payload.id)
    expect(content).toEqual(payload.content)
    expect(date).toEqual(payload.date)
    expect(username).toEqual(payload.username)
    expect(getpayload2.content).toEqual(payload2.content)
  })
})
