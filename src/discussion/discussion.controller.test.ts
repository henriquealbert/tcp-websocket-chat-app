import { describe, expect, test, vi } from 'vitest'
import { Socket } from 'net'
import type { DiscussionService } from './discussion.service'
import { DiscussionController } from './discussion.controller'

const mockSocket = {
  emit: vi.fn()
} as unknown as Socket
const mockDiscussionService = {
  create: vi.fn(),
  findOne: vi.fn(),
  findAll: vi.fn()
}

const discussionController = new DiscussionController(
  mockDiscussionService as unknown as DiscussionService
)

describe('DiscussionController', () => {
  test('create calls discussionService.create with correct parameters', async () => {
    const requestId = 'request1'
    const params = ['reference1', 'content1']

    await discussionController.create(mockSocket, requestId, params)

    expect(mockDiscussionService.create).toBeCalledWith(mockSocket, requestId, ...params)
  })

  test('create emits an error message if discussionService.create throws', async () => {
    const requestId = 'request2'
    const params = ['reference2', 'content2']

    mockDiscussionService.create.mockRejectedValueOnce(new Error())

    await discussionController.create(mockSocket, requestId, params)

    expect(mockSocket.emit).toBeCalledWith('error', {
      message: `${requestId}|ERROR|Error trying to find all discussions\n`
    })
  })

  test('findOne calls discussionService.findOne with correct parameters', async () => {
    const requestId = 'request3'
    const params = ['discussionId3']

    await discussionController.findOne(mockSocket, requestId, params)

    expect(mockDiscussionService.findOne).toBeCalledWith(mockSocket, requestId, ...params)
  })

  test('findOne emits an error message if discussionService.findOne throws', async () => {
    const requestId = 'request4'
    const params = ['discussionId4']

    mockDiscussionService.findOne.mockRejectedValueOnce(new Error())

    await discussionController.findOne(mockSocket, requestId, params)

    expect(mockSocket.emit).toBeCalledWith('error', {
      message: `${requestId}|ERROR|Error trying to find a discussion\n`
    })
  })

  test('findAll calls discussionService.findAll with correct parameters', async () => {
    const requestId = 'request5'
    const params = ['reference5']

    await discussionController.findAll(mockSocket, requestId, params)

    expect(mockDiscussionService.findAll).toBeCalledWith(mockSocket, requestId, ...params)
  })

  test('findAll emits an error message if discussionService.findAll throws', async () => {
    const requestId = 'request6'
    const params = ['reference6']

    mockDiscussionService.findAll.mockRejectedValueOnce(new Error())

    await discussionController.findAll(mockSocket, requestId, params)

    expect(mockSocket.emit).toBeCalledWith('error', {
      message: `${requestId}|ERROR|Error trying to find all discussions\n`
    })
  })
})
