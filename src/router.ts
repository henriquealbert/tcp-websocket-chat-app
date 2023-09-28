import { Socket } from 'net'

import { AuthController } from '@/auth/auth.controller'
import { Validator } from '@/utils/validators'
import {
  CREATE_DISCUSSION,
  CREATE_REPLY,
  GET_DISCUSSION,
  LIST_DISCUSSIONS,
  SIGN_IN,
  SIGN_OUT,
  WHOAMI
} from '@/utils/constants'
import { DiscussionController } from '@/discussion/discussion.controller'
import { ReplyController } from './reply/reply.controller'

export class Router {
  private routes: Record<
    string,
    (socket: Socket, requestId: string, params: string[]) => Promise<void> | void
  >

  constructor(
    private authController: AuthController,
    private discussionController: DiscussionController,
    private replyController: ReplyController
  ) {
    this.routes = {
      [SIGN_IN]: this.authController.signIn.bind(authController),
      [SIGN_OUT]: this.authController.signOut.bind(authController),
      [WHOAMI]: this.authController.whoAmI.bind(authController),
      [CREATE_DISCUSSION]: this.discussionController.create.bind(discussionController),
      [GET_DISCUSSION]: this.discussionController.findOne.bind(discussionController),
      [LIST_DISCUSSIONS]: this.discussionController.findAll.bind(discussionController),
      [CREATE_REPLY]: this.replyController.create.bind(replyController)
    }
  }

  private parseRequest = (request: string): [string, string, string[]] => {
    const data = request.split('|')
    Validator.validateDataLength(data)

    const [requestId, route, ...args] = data
    Validator.validateRequestId(requestId)

    return [requestId, route, args]
  }

  handleRequest = async (socket: Socket, request: string) => {
    const [requestId, route, params] = this.parseRequest(request)
    const handler = this.routes[route]

    if (!handler) {
      socket.emit('error', { message: `${requestId}|ERROR|Invalid route\n` })
    }

    try {
      await handler(socket, requestId, params)
    } catch (error) {
      socket.emit('error', { message: `${requestId}|ERROR|Error when handling the request\n` })
    }
  }
}
