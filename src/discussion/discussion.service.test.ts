import { describe, expect, test, vi } from 'vitest'
import { Socket } from 'net'
import prisma from '@/libs/__mocks__/prisma'
import { SessionsService } from '@/session/session.service'
import { DiscussionService } from './discussion.service'

vi.mock('@/libs/prisma')

const mockSocket = {
  emit: vi.fn(),
  write: vi.fn()
} as unknown as Socket
const mockSessionsService = {
  findOne: vi.fn()
}

const discussionService = new DiscussionService(mockSessionsService as unknown as SessionsService)

describe('DiscussionService', () => {
  test('create should call prisma.discussion.create with correct parameters', async () => {
    const requestId = 'request1'
    const reference = 'ref1'
    const content = 'Content1'
    const userId = 'user1'
    const mockResponse = {
      id: 'discuss1',
      content,
      reference,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockSessionsService.findOne.mockReturnValueOnce(userId)
    prisma.discussion.create.mockResolvedValueOnce(mockResponse)
    await discussionService.create(mockSocket, requestId, reference, content)
    expect(prisma.discussion.create).toBeCalledWith({
      data: {
        content,
        reference,
        userId
      }
    })
  })
  test('create should return error if user is not signed in', async () => {
    const requestId = 'request2'
    const reference = 'ref2'
    const content = 'Content2'
    mockSessionsService.findOne.mockReturnValueOnce(null)
    await expect(
      discussionService.create(mockSocket, requestId, reference, content)
    ).rejects.toThrowError(`${requestId}|ERROR|You must be signed in to create a discussion\n`)
  })
  test('create should return error if database error', async () => {
    const requestId = 'request3'
    const reference = 'ref3'
    const content = 'Content3'
    const userId = 'user3'
    mockSessionsService.findOne.mockReturnValueOnce(userId)
    prisma.discussion.create.mockRejectedValueOnce(new Error('Database error'))
    await expect(
      discussionService.create(mockSocket, requestId, reference, content)
    ).rejects.toThrowError(`${requestId}|ERROR|Database error\n`)
  })
  test('findOne should call prisma.discussion.findUnique with correct parameters', async () => {
    const requestId = 'request3'
    const discussionId = 'discuss3'
    const mockResponse = {
      id: discussionId,
      content: 'Sample content',
      reference: 'Sample reference',
      userId: 'user1',
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { clientId: 'user1' }
    }
    prisma.discussion.findUnique.mockResolvedValueOnce(mockResponse)
    await discussionService.findOne(mockSocket, requestId, discussionId)
    expect(prisma.discussion.findUnique).toBeCalledWith({
      where: { id: discussionId },
      include: {
        replies: { include: { user: true } },
        user: true
      }
    })
    expect(mockSocket.write).toBeCalledWith(
      `${requestId}|${discussionId}|${mockResponse.reference}|(${mockResponse.user.clientId}|${mockResponse.content})\n`
    )
  })
  test('findOne should return error message if discussion is not found', async () => {
    const requestId = 'request4'
    const discussionId = 'discuss4'
    prisma.discussion.findUnique.mockResolvedValueOnce(null)
    await expect(
      discussionService.findOne(mockSocket, requestId, discussionId)
    ).rejects.toThrowError(`${requestId}|ERROR|Database error\n`)
  })
  test('findOne should return error message if there is a database error', async () => {
    const requestId = 'request5'
    const discussionId = 'discuss5'
    prisma.discussion.findUnique.mockRejectedValueOnce(new Error('Database error'))
    await expect(
      discussionService.findOne(mockSocket, requestId, discussionId)
    ).rejects.toThrowError(`${requestId}|ERROR|Database error\n`)
  })
  test('findAll should call prisma.discussion.findMany with correct parameters', async () => {
    const requestId = 'request1'
    const reference = 'ref1'
    const mockResponse = [
      {
        id: 'discuss1',
        content: 'Content1',
        reference: 'ref1',
        userId: 'user1',
        user: { clientId: 'client1' },
        createdAt: new Date(),
        updatedAt: new Date(),
        replies: [
          {
            user: { clientId: 'client2' },
            content: 'Reply1'
          }
        ]
      },
      {
        id: 'discuss2',
        content: 'Content2',
        reference: 'ref2',
        userId: 'user2',
        user: { clientId: 'client3' },
        createdAt: new Date(),
        updatedAt: new Date(),
        replies: [
          {
            user: { clientId: 'client4' },
            content: 'Reply2'
          }
        ]
      }
    ]
    prisma.discussion.findMany.mockResolvedValueOnce(mockResponse)
    await discussionService.findAll(mockSocket, requestId, reference)
    expect(prisma.discussion.findMany).toBeCalledWith({
      where: {
        reference: {
          startsWith: reference
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true
          }
        }
      }
    })
  })
  test('findAll should return error if database error', async () => {
    const requestId = 'request2'
    const reference = 'ref2'
    prisma.discussion.findMany.mockRejectedValueOnce(new Error('Database error'))
    await expect(discussionService.findAll(mockSocket, requestId, reference)).rejects.toThrowError(
      `${requestId}|ERROR|Database error\n`
    )
  })
  test('findAll should format content correctly if it includes a comma', async () => {
    const requestId = 'request1'
    const reference = 'ref1'
    const discussionData = [
      {
        id: 'discussion1',
        content: 'This is a test message, with a comma',
        reference,
        userId: 'userId1',
        user: { clientId: 'user1' },
        createdAt: new Date(),
        updatedAt: new Date(),
        replies: []
      }
    ]
    prisma.discussion.findMany.mockResolvedValueOnce(discussionData)
    await discussionService.findAll(mockSocket, requestId, reference)
    const expectedResponse = `${requestId}|(discussion1|ref1|(user1|"This is a test message, with a comma"))\n`
    expect(mockSocket.write).toBeCalledWith(expectedResponse)
  })
  test('findAll should format content correctly if it does not include a comma', async () => {
    const requestId = 'request2'
    const reference = 'ref2'
    const discussionData = [
      {
        id: 'discuss2',
        content: 'Content2',
        reference: 'ref2',
        userId: 'user2',
        user: { clientId: 'client3' },
        createdAt: new Date(),
        updatedAt: new Date(),
        replies: [
          {
            user: { clientId: 'client4' },
            content: 'Reply2'
          }
        ]
      }
    ]
    prisma.discussion.findMany.mockResolvedValueOnce(discussionData)
    await discussionService.findAll(mockSocket, requestId, reference)

    const expectedResponse = `${requestId}|(discuss2|ref2|(client3|Content2,client4|Reply2))\n`
    expect(mockSocket.write).toBeCalledWith(expectedResponse)
  })
})
