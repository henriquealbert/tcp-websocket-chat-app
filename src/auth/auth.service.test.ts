import { Socket } from 'net'
import { expect, test, vi, describe } from 'vitest'

import { SessionsService } from '@/session/session.service'
import { AuthService } from '@/auth/auth.service'
import prisma from '@/libs/__mocks__/prisma'

vi.mock('@/libs/prisma')

const mockSocket = {
  write: vi.fn()
} as unknown as Socket

describe('AuthService', () => {
  test('signIn should return requestId when sign in is successful', async () => {
    const sessionsService = new SessionsService()
    const authService = new AuthService(sessionsService)
    const user = {
      id: '1',
      clientId: 'Alpha',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    prisma.user.upsert.mockResolvedValue(user)
    const requestId = 'request1'
    await authService.signIn(mockSocket, requestId, user.clientId)
    expect(mockSocket.write).toHaveBeenCalledWith(`${requestId}\n`)
  })

  test('signIn should return error when database error occurs', async () => {
    const sessionsService = new SessionsService()
    const authService = new AuthService(sessionsService)

    prisma.user.upsert.mockRejectedValue(new Error('Database error'))
    const requestId = 'request1'
    await expect(authService.signIn(mockSocket, requestId, 'Alpha')).rejects.toThrowError(
      `${requestId}|ERROR|Database error\n`
    )
  })

  test('signOut should return requestId', () => {
    const sessionsService = new SessionsService()
    const authService = new AuthService(sessionsService)

    const requestId = 'request2'
    authService.signOut(mockSocket, requestId)
    expect(mockSocket.write).toHaveBeenCalledWith(`${requestId}\n`)
  })

  test('whoAmI should return user clientId when user is signed in', async () => {
    const sessionsService = new SessionsService()
    const authService = new AuthService(sessionsService)

    const user = {
      id: '1',
      clientId: 'Alpha',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    sessionsService.create(mockSocket, user.id)
    prisma.user.findUnique.mockResolvedValue(user)
    const requestId = 'request3'
    await authService.whoAmI(mockSocket, requestId)
    expect(mockSocket.write).toHaveBeenCalledWith(`${requestId}|${user.clientId}\n`)
  })

  test('whoAmI should return error when user is not signed in', async () => {
    const sessionsService = new SessionsService()
    const authService = new AuthService(sessionsService)

    const requestId = 'request4'
    await expect(authService.whoAmI(mockSocket, requestId)).rejects.toThrowError(
      `${requestId}|ERROR|Not signed in\n`
    )
  })

  test('whoAmI should return error when database error occurs', async () => {
    const sessionsService = new SessionsService()
    const authService = new AuthService(sessionsService)

    const user = {
      id: '1',
      clientId: 'Alpha',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    sessionsService.create(mockSocket, user.id)
    prisma.user.findUnique.mockRejectedValue(new Error('Database error'))
    const requestId = 'request5'
    await expect(authService.whoAmI(mockSocket, requestId)).rejects.toThrowError(
      `${requestId}|ERROR|Database error\n`
    )
  })
})
