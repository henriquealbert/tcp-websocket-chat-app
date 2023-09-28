import { Socket } from 'net'

import { DiscussionService } from './discussion.service'

export class DiscussionController {
  constructor(private discussionService: DiscussionService) {}

  async create(socket: Socket, requestId: string, params: string[]) {
    const [reference, content] = params

    try {
      await this.discussionService.create(socket, requestId, reference, content)
    } catch (error) {
      socket.emit('error', { message: `${requestId}|ERROR|Error trying to find all discussions\n` })
    }
  }

  async findOne(socket: Socket, requestId: string, params: string[]) {
    const [discussionId] = params

    try {
      await this.discussionService.findOne(socket, requestId, discussionId)
    } catch (error) {
      socket.emit('error', { message: `${requestId}|ERROR|Error trying to find a discussion\n` })
    }
  }

  async findAll(socket: Socket, requestId: string, params: string[]) {
    const [reference] = params

    try {
      await this.discussionService.findAll(socket, requestId, reference)
    } catch (error) {
      socket.emit('error', { message: `${requestId}|ERROR|Error trying to find all discussions\n` })
    }
  }
}
