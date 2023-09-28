import { Socket } from 'net'

import { AuthService } from './auth.service'

export class AuthController {
  constructor(private authService: AuthService) {}

  async signIn(socket: Socket, requestId: string, params: string[]) {
    const [clientId] = params

    try {
      await this.authService.signIn(socket, requestId, clientId)
    } catch (error) {
      socket.emit('error', { message: `${requestId}|ERROR|Error trying to sign in\n` })
    }
  }

  signOut(socket: Socket, requestId: string) {
    this.authService.signOut(socket, requestId)
  }

  async whoAmI(socket: Socket, requestId: string) {
    try {
      await this.authService.whoAmI(socket, requestId)
    } catch (error) {
      socket.emit('error', { message: `${requestId}|ERROR|Error trying to get the current user\n` })
    }
  }
}
