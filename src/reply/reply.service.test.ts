import { describe, expect, test, vi } from 'vitest'
import prisma from '@/libs/__mocks__/prisma'
import { ReplyService } from './reply.service'
import { SessionsService } from '@/session/session.service'
import { Socket } from 'net'
import { NotificationService } from '@/notification/notification.service'
import { DISCUSSION_UPDATED } from '@/utils/constants'

const mockSocket = {
  emit: vi.fn(),
  write: vi.fn()
} as unknown as Socket

vi.mock('@/libs/prisma')

const mockSessionsService = {
  findOne: vi.fn()
}

const mockNotificationService = {
  notifyUsers: vi.fn()
} as unknown as NotificationService

const replyService = new ReplyService(
  mockSessionsService as unknown as SessionsService,
  mockNotificationService
)

describe('ReplyService', () => {
  test('create should throw error if user is not signed in', async () => {
    const requestId = 'request2'
    const discussionId = 'discuss2'
    const content = 'Content2'

    mockSessionsService.findOne.mockReturnValueOnce(null)

    await expect(
      replyService.create(mockSocket, requestId, discussionId, content)
    ).rejects.toThrowError(`${requestId}|ERROR|You must be signed in to create a discussion\n`)
  })

  test('create should throw error if database error', async () => {
    const requestId = 'request1'
    const discussionId = 'discuss1'
    const content = 'Content1'
    const userId = 'user1'

    mockSessionsService.findOne.mockReturnValueOnce(userId)

    prisma.reply.create.mockRejectedValue(new Error('Database error'))

    await expect(
      replyService.create(mockSocket, requestId, discussionId, content)
    ).rejects.toThrowError(`${requestId}|ERROR|Database error\n`)
  })

  test('create should notify participants if a reply is created', async () => {
    const requestId = 'request1'
    const discussionId = 'discuss1'
    const content = 'Content1'
    const userId = 'user1'

    const mockDiscussion = {
      id: discussionId,
      reference: 'ref1',
      content: 'Content1',
      userId: 'user2',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { id: 'user2' },
      replies: [{ userId: 'user3' }, { userId: 'user4' }]
    }

    mockSessionsService.findOne.mockReturnValueOnce(userId)

    prisma.reply.create.mockResolvedValueOnce({
      id: 'reply1',
      createdAt: new Date(),
      updatedAt: new Date(),
      content: '',
      discussionId: '',
      userId: ''
    })

    prisma.discussion.findUnique.mockResolvedValueOnce(mockDiscussion)

    await replyService.create(mockSocket, requestId, discussionId, content)

    const participantIds = [mockDiscussion.userId, ...mockDiscussion.replies.map((r) => r.userId)]

    expect(mockNotificationService.notifyUsers).toHaveBeenCalledWith(
      DISCUSSION_UPDATED,
      participantIds,
      discussionId
    )
  })
})
