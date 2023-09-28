import { SessionsService } from '@/session/session.service'

export class NotificationService {
  constructor(private sessionsService: SessionsService) {}

  notifyUser(route: string, userId: string, message: string) {
    if (!userId || !message) {
      throw new Error('Invalid parameters')
    }

    const userSocket = this.sessionsService.findSocketByUserId(userId)
    if (!userSocket) {
      throw new Error(`No socket found for user ${userId}`)
    }

    try {
      userSocket.write(`${route}|${message}\n`)
    } catch (error) {
      throw new Error(`Failed to send message to user ${userId}`)
    }
  }

  notifyUsers(route: string, userIds: string[], message: string) {
    if (!userIds || userIds.length === 0 || !message) {
      throw new Error('Invalid parameters')
    }

    userIds.forEach((userId) => {
      this.notifyUser(route, userId, message)
    })
  }
}
