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
  it('should create addedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: ['2023-09-22'],
      username: true,
      is_delete: '0'
    }

    // Action
    const addedThread = new GetDetailThread(payload)

    // Assert
    expect(addedThread.id).toEqual(payload.id)
    expect(addedThread.title).toEqual(payload.title)
    expect(addedThread.body).toEqual(payload.body)
    expect(addedThread.date).toEqual(payload.date)
    expect(addedThread.username).toEqual(payload.username)
    expect(addedThread.is_delete).toEqual(payload.is_delete)
  })
})
