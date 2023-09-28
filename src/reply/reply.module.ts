import { SessionsService } from '@/session/session.service'
import { NotificationService } from '@/notification/notification.service'
import { ReplyController } from './reply.controller'
import { ReplyService } from './reply.service'

export class ReplyModule {
  private replyService: ReplyService
  private replyController: ReplyController

  constructor(
    private sessionsService: SessionsService,
    private notificationService: NotificationService
  ) {
    this.replyService = new ReplyService(this.sessionsService, this.notificationService)
    this.replyController = new ReplyController(this.replyService)
  }

  getController(): ReplyController {
    return this.replyController
  }
}
