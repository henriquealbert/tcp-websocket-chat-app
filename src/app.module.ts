import { Socket } from 'net'
import { SessionsService } from '@/session/session.service'
import { Router } from '@/router'
import { AppService } from '@/app.service'
import { AuthModule } from '@/auth/auth.module'
import { DiscussionModule } from '@/discussion/discussion.module'
import { ReplyModule } from './reply/reply.module'
import { NotificationModule } from './notification/notification.module'

export class AppModule {
  constructor(socket: Socket, sessionsService: SessionsService) {
    const authModule = new AuthModule(sessionsService)
    const discussionModule = new DiscussionModule(sessionsService)
    const notificationModule = new NotificationModule(sessionsService)
    const replyModule = new ReplyModule(sessionsService, notificationModule.getService())

    const router = new Router(
      authModule.getController(),
      discussionModule.getController(),
      replyModule.getController()
    )
    new AppService(socket, sessionsService, router)
  }
}
