import { SessionsService } from '@/session/session.service'
import { NotificationService } from './notification.service'

export class NotificationModule {
  private notificationService: NotificationService

  constructor(private sessionsService: SessionsService) {
    this.notificationService = new NotificationService(this.sessionsService)
  }

  getService(): NotificationService {
    return this.notificationService
  }
}
