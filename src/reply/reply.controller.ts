import { Socket } from 'net'

import { ReplyService } from './reply.service'

export class ReplyController {
  constructor(private replyService: ReplyService) {}

  async create(socket: Socket, requestId: string, params: string[]) {
    const [discussionId, content] = params

    try {
      await this.replyService.create(socket, requestId, discussionId, content)
    } catch (error) {
      socket.emit('error', { message: `${requestId}|ERROR|Error trying to create a reply\n` })
    }
  }
}
