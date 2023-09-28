import { Socket } from 'net'

import prisma from '@/libs/prisma'
import { SessionsService } from '@/session/session.service'
import { MessageFormatter } from './MessageFormatter'

export class DiscussionService {
  private messageFormatter = new MessageFormatter()

  constructor(private sessionsService: SessionsService) {}

  async create(socket: Socket, requestId: string, reference: string, content: string) {
    const userId = this.sessionsService.findOne(socket)

    if (!userId) {
      throw new Error(`${requestId}|ERROR|You must be signed in to create a discussion\n`)
    }

    try {
      const discussion = await prisma.discussion.create({
        data: {
          content,
          reference,
          userId
        }
      })

      socket.write(`${requestId}|${discussion.id}\n`)
    } catch (e) {
      throw new Error(`${requestId}|ERROR|Database error\n`)
    }
  }

  async findOne(socket: Socket, requestId: string, discussionId: string) {
    try {
      const discussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
        include: {
          replies: {
            include: {
              user: true
            }
          },
          user: true
        }
      })

      if (!discussion) {
        throw new Error(`${requestId}|ERROR|Discussion not found\n`)
      }

      socket.write(this.messageFormatter.formatFindOneResponse(requestId, discussion))
    } catch (e) {
      throw new Error(`${requestId}|ERROR|Database error\n`)
    }
  }

  async findAll(socket: Socket, requestId: string, reference: string) {
    try {
      const discussions = await prisma.discussion.findMany({
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
      discussions.sort((a, b) => a.reference.localeCompare(b.reference))

      socket.write(this.messageFormatter.formatFindAllResponse(requestId, discussions))
    } catch (e) {
      throw new Error(`${requestId}|ERROR|Database error\n`)
    }
  }
}
