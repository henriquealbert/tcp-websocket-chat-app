import { Socket } from 'net'

import prisma from '@/libs/prisma'
import { SessionsService } from '@/session/session.service'
import { DISCUSSION_UPDATED } from '@/utils/constants'
import { NotificationService } from '@/notification/notification.service'

export class ReplyService {
  constructor(
    private sessionsService: SessionsService,
    private notificationService: NotificationService
  ) {}

  async create(socket: Socket, requestId: string, discussionId: string, content: string) {
    const userId = this.sessionsService.findOne(socket)

    if (!userId) {
      throw new Error(`${requestId}|ERROR|You must be signed in to create a discussion\n`)
    }

    try {
      await prisma.reply.create({
        data: {
          content,
          discussionId,
          userId
        }
      })

      socket.write(`${requestId}\n`)

      await this.notifyParticipants(requestId, discussionId)
      await this.notifyMentionedUsers(requestId, discussionId, content)
    } catch (e) {
      throw new Error(`${requestId}|ERROR|Database error\n`)
    }
  }

  private async findParticipants(requestId: string, discussionId: string) {
    try {
      const discussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
        include: {
          user: {
            select: {
              id: true
            }
          },
          replies: {
            select: {
              userId: true
            }
          }
        }
      })

      if (!discussion) {
        throw new Error(`${requestId}|ERROR|Discussion not found\n`)
      }

      const discussionStarterId = discussion.user.id
      const replyUserIds = discussion.replies.map((reply) => reply.userId)
      let participantIds = [discussionStarterId, ...replyUserIds]
      participantIds = Array.from(new Set(participantIds))

      return participantIds
    } catch (e) {
      throw new Error(`${requestId}|ERROR|Database error\n`)
    }
  }

  private async notifyParticipants(requestId: string, discussionId: string) {
    try {
      const participantIds = await this.findParticipants(requestId, discussionId)
      if (!participantIds) {
        return
      }

      this.notificationService.notifyUsers(DISCUSSION_UPDATED, participantIds, discussionId)
    } catch (e) {
      throw new Error(`${requestId}|ERROR|Database error\n`)
    }
  }

  private async notifyMentionedUsers(
    requestId: string,
    discussionId: string,
    replyContent: string
  ) {
    try {
      const mentionedUsersIds = this.extractMentions(replyContent)

      if (!mentionedUsersIds.length) {
        return
      }

      const users = await prisma.user.findMany({
        where: {
          clientId: {
            in: mentionedUsersIds
          }
        },
        select: {
          id: true
        }
      })

      const usersIds = users.map((user) => user.id)

      this.notificationService.notifyUsers(DISCUSSION_UPDATED, usersIds, discussionId)
    } catch (e) {
      throw new Error(`${requestId}|ERROR|Database error\n`)
    }
  }

  private extractMentions(comment: string): string[] {
    const mentions = comment.match(/@\w+/g) || []
    return mentions.map((mention) => mention.substring(1))
  }
}
