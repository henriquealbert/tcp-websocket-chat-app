import { SessionsService } from '@/session/session.service'
import { describe, expect, test, vi } from 'vitest'
import { NotificationService } from './notification.service'
import { Socket } from 'net'

const mockSocket1 = {
  write: vi.fn()
} as unknown as Socket
const mockSocket2 = {
  write: vi.fn()
} as unknown as Socket

const sessionsService = new SessionsService()
const notificationService = new NotificationService(sessionsService)

describe('NotificationService', () => {
  test('should notify a single user', () => {
    sessionsService.create(mockSocket1, 'userId1')

    expect(() => notificationService.notifyUser('route1', 'userId1', 'Hello!')).not.toThrow()
    expect(mockSocket1.write).toHaveBeenCalledWith('route1|Hello!\n')
  })

  test('should return error when no userId provided', () => {
    expect(() => notificationService.notifyUser('route1', '', 'Hello!')).toThrow(
      'Invalid parameters'
    )
  })

  test('should return error when no message provided', () => {
    sessionsService.create(mockSocket1, 'userId1')
    expect(() => notificationService.notifyUser('route1', 'userId1', '')).toThrow(
      'Invalid parameters'
    )
  })

  test('should return error when no socket found for user', () => {
    expect(() => notificationService.notifyUser('route1', 'unknownUser', 'Hello!')).toThrow(
      'No socket found for user unknownUser'
    )
  })

  test('should notify multiple users', () => {
    sessionsService.create(mockSocket1, 'userId1')
    sessionsService.create(mockSocket2, 'userId2')

    expect(() =>
      notificationService.notifyUsers('route1', ['userId1', 'userId2'], 'Hello everyone!')
    ).not.toThrow()
    expect(mockSocket1.write).toHaveBeenCalledWith('route1|Hello everyone!\n')
    expect(mockSocket2.write).toHaveBeenCalledWith('route1|Hello everyone!\n')
  })

  test('should return errors for users that could not be notified', () => {
    sessionsService.create(mockSocket1, 'userId1')

    expect(() =>
      notificationService.notifyUsers('route1', ['userId1', 'unknownUser'], 'Hello!')
    ).toThrow('No socket found for user unknownUser')
  })

  test('should return error when no userIds provided', () => {
    expect(() => notificationService.notifyUsers('route1', [], 'Hello!')).toThrow(
      'Invalid parameters'
    )
  })

  test('should return error if writing to the socket fails', () => {
    sessionsService.create(mockSocket1 as Socket, 'userId1')

    mockSocket1.write = vi.fn().mockImplementation(() => {
      throw new Error('Socket write error')
    })

    expect(() => notificationService.notifyUser('route1', 'userId1', 'Hello, userId1')).toThrow(
      'Failed to send message to user userId1'
    )
    expect(mockSocket1.write).toHaveBeenCalledTimes(1)
  })
})
