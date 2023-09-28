import { Socket } from 'net'

import prisma from '@/libs/prisma'
import { SessionsService } from '@/session/session.service'

export class AuthService {
  constructor(private sessionsService: SessionsService) {}

  async signIn(socket: Socket, requestId: string, clientId: string) {
    try {
      const user = await prisma.user.upsert({
        where: { clientId },
        update: {},
        create: { clientId }
      })

      this.sessionsService.create(socket, user.id)
    } catch (e) {
      throw new Error(`${requestId}|ERROR|Database error\n`)
    }

    socket.write(`${requestId}\n`)
  }

  signOut(socket: Socket, requestId: string) {
    this.sessionsService.remove(socket)

    socket.write(`${requestId}\n`)
  }

  async whoAmI(socket: Socket, requestId: string) {
    const userId = this.sessionsService.findOne(socket)

    if (!userId) {
      throw new Error(`${requestId}|ERROR|Not signed in\n`)
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      socket.write(`${requestId}|${user?.clientId}\n`)
    } catch (e) {
      throw new Error(`${requestId}|ERROR|Database error\n`)
    }
  }
}
