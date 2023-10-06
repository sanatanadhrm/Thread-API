const GetDetailThread = require('../GetDetailThread')

describe('a getDetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread'
    }
    expect(() => new GetDetailThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: ['2023-09-22'],
      username: true
    }

    // Action and Assert
    expect(() => new GetDetailThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })
  it('should get DetailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-09-22',
      username: 'sanatana'
    }

    // Action
    const getDetailThread = new GetDetailThread(payload)

    // Assert
    expect(getDetailThread.id).toEqual(payload.id)
    expect(getDetailThread.title).toEqual(payload.title)
    expect(getDetailThread.body).toEqual(payload.body)
    expect(getDetailThread.date).toEqual(payload.date)
    expect(getDetailThread.username).toEqual(payload.username)
  })
})
