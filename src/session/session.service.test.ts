import { Socket } from 'net'
import { expect, it, describe } from 'vitest'

import { SessionsService } from '@/session/session.service'

const mockSocket1 = new Socket()
const mockSocket2 = new Socket()
const sessionsService = new SessionsService()

describe('SessionsService', () => {
  it('should create a new session', () => {
    sessionsService.create(mockSocket1, 'userId1')
    expect(sessionsService.findOne(mockSocket1)).toBe('userId1')
  })

  it('should find a specific session', () => {
    sessionsService.create(mockSocket1, 'userId1')
    const session = sessionsService.findOne(mockSocket1)
    expect(session).toBe('userId1')
  })

  it('should find all sessions', () => {
    sessionsService.create(mockSocket1, 'userId1')
    sessionsService.create(mockSocket2, 'userId2')
    const allSessions = sessionsService.findAll()
    expect(allSessions).toEqual(
      expect.arrayContaining([
        [mockSocket1, 'userId1'],
        [mockSocket2, 'userId2']
      ])
    )
  })

  it('should remove a session', () => {
    sessionsService.create(mockSocket1, 'userId1')
    sessionsService.remove(mockSocket1)
    expect(sessionsService.findOne(mockSocket1)).toBeUndefined()
  })

  it('should find a session by userId', () => {
    sessionsService.create(mockSocket1, 'userId1')
    const session = sessionsService.findSocketByUserId('userId1')
    expect(session).toBe(mockSocket1)
  })
})
