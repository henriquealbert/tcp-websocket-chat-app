import { Socket } from 'net'
import { describe, expect, test, vi } from 'vitest'
import { ReplyService } from './reply.service'
import { ReplyController } from './reply.controller'

const mockSocket = {
  emit: vi.fn()
} as unknown as Socket
const mockReplyService = {
  create: vi.fn()
} as unknown as ReplyService

const replyController = new ReplyController(mockReplyService)

describe('ReplyController', () => {
  test('create should call replyService.create with correct parameters', async () => {
    const requestId = 'request1'
    const discussionId = 'discuss1'
    const content = 'Content1'
    await replyController.create(mockSocket, requestId, [discussionId, content])
    expect(mockReplyService.create).toBeCalledWith(mockSocket, requestId, discussionId, content)
  })

  test('create should emit an error message when replyService.create throws an error', async () => {
    const requestId = 'request1'
    const discussionId = 'discuss1'
    const content = 'Content1'
    mockReplyService.create = vi.fn().mockRejectedValueOnce(new Error('Error'))
    await replyController.create(mockSocket, requestId, [discussionId, content])
    expect(mockSocket.emit).toBeCalledWith('error', {
      message: `${requestId}|ERROR|Error trying to create a reply\n`
    })
  })
})
