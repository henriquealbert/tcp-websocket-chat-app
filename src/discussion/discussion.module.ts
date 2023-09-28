import { SessionsService } from '@/session/session.service'
import { DiscussionController } from './discussion.controller'
import { DiscussionService } from './discussion.service'

export class DiscussionModule {
  private discussionService: DiscussionService
  private discussionController: DiscussionController

  constructor(private sessionsService: SessionsService) {
    this.discussionService = new DiscussionService(this.sessionsService)
    this.discussionController = new DiscussionController(this.discussionService)
  }

  getController(): DiscussionController {
    return this.discussionController
  }
}
