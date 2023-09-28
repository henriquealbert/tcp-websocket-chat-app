import { describe, expect, test, vi } from 'vitest'
import { AuthController } from './auth.controller'
import { Socket } from 'net'
import { AuthService } from './auth.service'

const mockSocket = {
  emit: vi.fn()
} as unknown as Socket
const mockAuthService = {
  signIn: vi.fn(),
  signOut: vi.fn(),
  whoAmI: vi.fn(),
  sessionsService: {}
}

const authController = new AuthController(mockAuthService as unknown as AuthService)

describe('AuthController', () => {
  test('signIn should call authService.signIn with correct parameters', async () => {
    const requestId = 'request1'
    const clientId = 'Alpha'
    await authController.signIn(mockSocket, requestId, [clientId])
    expect(mockAuthService.signIn).toBeCalledWith(mockSocket, requestId, clientId)
  })

  test('signIn should emit an error message if authService.signIn throws an error', async () => {
    const requestId = 'request1'
    const clientId = 'Alpha'
    mockAuthService.signIn.mockRejectedValue(new Error('Database error'))

    await authController.signIn(mockSocket, requestId, [clientId])
    expect(mockSocket.emit).toBeCalledWith('error', {
      message: `${requestId}|ERROR|Error trying to sign in\n`
    })
  })

  test('signOut should call authService.signOut with correct parameters', () => {
    const requestId = 'request2'
    authController.signOut(mockSocket, requestId)
    expect(mockAuthService.signOut).toBeCalledWith(mockSocket, requestId)
  })

  test('whoAmI should call authService.whoAmI with correct parameters', async () => {
    const requestId = 'request3'
    await authController.whoAmI(mockSocket, requestId)
    expect(mockAuthService.whoAmI).toBeCalledWith(mockSocket, requestId)
  })

  test('whoAmI should emit an error message if authService.whoAmI throws an error', async () => {
    const requestId = 'request3'
    mockAuthService.whoAmI.mockRejectedValue(new Error('Database error'))
    await authController.whoAmI(mockSocket, requestId)
    expect(mockSocket.emit).toBeCalledWith('error', {
      message: `${requestId}|ERROR|Error trying to get the current user\n`
    })
  })
})
