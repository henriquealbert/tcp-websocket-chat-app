import { describe, expect, test, vi } from 'vitest'
import { Router } from '@/router'
import { AuthController } from '@/auth/auth.controller'
import { Validator } from '@/utils/validators'
import { SIGN_IN, SIGN_OUT, WHOAMI } from '@/utils/constants'
import { Socket } from 'net'
import { DiscussionController } from './discussion/discussion.controller'
import { ReplyController } from './reply/reply.controller'

vi.mock('@/auth/auth.controller')
vi.mock('@/utils/validators')

const mockSocket = {
  emit: vi.fn(),
  write: vi.fn()
} as unknown as Socket
const mockAuthController = {
  signIn: vi.fn(),
  signOut: vi.fn(),
  whoAmI: vi.fn()
} as unknown as AuthController
const mockDiscussionController = {
  create: vi.fn(),
  findOne: vi.fn(),
  findAll: vi.fn()
} as unknown as DiscussionController

const mockReplyController = {
  create: vi.fn()
} as unknown as ReplyController

const router = new Router(mockAuthController, mockDiscussionController, mockReplyController)

Validator.validateDataLength = vi.fn() as unknown as typeof Validator.validateDataLength
Validator.validateRequestId = vi.fn() as unknown as typeof Validator.validateRequestId

describe('Router', () => {
  test('handleRequest should correctly handle SIGN_IN route', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|${SIGN_IN}|clientId`
    await router.handleRequest(mockSocket, request)
    expect(mockAuthController.signIn).toBeCalledWith(mockSocket, requestId, ['clientId'])
  })

  test('handleRequest should correctly handle SIGN_OUT route', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|${SIGN_OUT}`
    await router.handleRequest(mockSocket, request)
    expect(mockAuthController.signOut).toBeCalledWith(mockSocket, requestId, [])
  })

  test('handleRequest should correctly handle WHOAMI route', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|${WHOAMI}`
    await router.handleRequest(mockSocket, request)
    expect(mockAuthController.whoAmI).toBeCalledWith(mockSocket, requestId, [])
  })

  test('handleRequest should correctly handle CREATE_DISCUSSION route', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|CREATE_DISCUSSION|reference|content`
    await router.handleRequest(mockSocket, request)
    expect(mockDiscussionController.create).toBeCalledWith(mockSocket, requestId, [
      'reference',
      'content'
    ])
  })

  test('handleRequest should correctly handle GET_DISCUSSION route', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|GET_DISCUSSION|discussionId`
    await router.handleRequest(mockSocket, request)
    expect(mockDiscussionController.findOne).toBeCalledWith(mockSocket, requestId, ['discussionId'])
  })

  test('handleRequest should correctly handle LIST_DISCUSSIONS route', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|LIST_DISCUSSIONS|reference`
    await router.handleRequest(mockSocket, request)
    expect(mockDiscussionController.findAll).toBeCalledWith(mockSocket, requestId, ['reference'])
  })

  test('handleRequest should correctly handle CREATE_REPLY route', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|CREATE_REPLY|discussionId|content`
    await router.handleRequest(mockSocket, request)
    expect(mockReplyController.create).toBeCalledWith(mockSocket, requestId, [
      'discussionId',
      'content'
    ])
  })

  test('handleRequest should return error message if invalid route is provided', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|INVALID_ROUTE`
    await router.handleRequest(mockSocket, request)
    expect(mockSocket.emit).toBeCalledWith('error', {
      message: `${requestId}|ERROR|Invalid route\n`
    })
  })

  test('handleRequest should call Validator.validateDataLength with correct parameters', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|${SIGN_IN}|clientId`
    await router.handleRequest(mockSocket, request)
    expect(Validator.validateDataLength).toBeCalledWith([requestId, SIGN_IN, 'clientId'])
  })

  test('handleRequest should call Validator.validateRequestId with correct parameters', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|${SIGN_IN}|clientId`
    await router.handleRequest(mockSocket, request)
    expect(Validator.validateRequestId).toBeCalledWith(requestId)
  })

  test('handleRequest should return error message if handler throws an error', async () => {
    const requestId = 'req1234'
    const request = `${requestId}|${SIGN_IN}|clientId`

    mockAuthController.signIn = vi
      .fn()
      .mockRejectedValueOnce(new Error('Error when handling the request'))
    await router.handleRequest(mockSocket, request)
    expect(mockSocket.emit).toBeCalledWith('error', {
      message: `${requestId}|ERROR|Error when handling the request\n`
    })
  })
})
