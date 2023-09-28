import { describe, expect, test, vi } from 'vitest'
import { AppService } from '@/app.service'
import { SessionsService } from '@/session/session.service'
import { Router } from '@/router'
import { Socket } from 'net'

vi.mock('@/session/session.service')
vi.mock('@/app.controller')

class MockSocket extends Socket {
  destroyed = false
  on = vi.fn()
  write = vi.fn()
  end = vi.fn()
  emit = vi.fn()
}

const mockSocket = new MockSocket()

const mockSessionsService = {
  create: vi.fn(),
  remove: vi.fn()
} as unknown as SessionsService

const mockRouter = {
  handleRequest: vi.fn()
} as unknown as Router
const appService = new AppService(mockSocket, mockSessionsService, mockRouter)

describe('AppService', () => {
  test('removes session on client connection close', () => {
    appService.handleClose()
    expect(mockSessionsService.remove).toBeCalledWith(mockSocket)
  })

  test('handleError writes error message to the socket and ends the connection if it is not already destroyed', () => {
    const error = new Error('error')
    mockSocket.destroyed = false

    appService.handleError(error)
    expect(mockSocket.write).toBeCalledWith(error.message)
    expect(mockSocket.end).toBeCalled()
  })

  test('handleEnd logs a message to the console', () => {
    const consoleSpy = vi.spyOn(console, 'info')

    appService.handleEnd()
    expect(consoleSpy).toBeCalledWith('Client disconnected.')
    consoleSpy.mockRestore()
  })

  test('calls handleRequest on router with correct parameters', async () => {
    const mockData = Buffer.from('test data')

    mockRouter.handleRequest = vi.fn().mockResolvedValueOnce(null)

    await appService.handleData(mockData)
    expect(mockRouter.handleRequest).toBeCalledWith(mockSocket, mockData.toString('utf8').trim())
  })

  test('does not emit error when handleRequest is successful', async () => {
    const mockData = Buffer.from('test data')

    mockRouter.handleRequest = vi.fn().mockResolvedValueOnce(null)

    await appService.handleData(mockData)
    expect(mockSocket.emit).not.toBeCalledWith('error', expect.anything())
  })
})
