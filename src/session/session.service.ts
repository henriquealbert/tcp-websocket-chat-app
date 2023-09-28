import { Socket } from 'net'

export class SessionsService {
  private readonly sessions = new Map<Socket, string | null>()

  create(socket: Socket, userId: string | null): void {
    this.sessions.set(socket, userId)
  }

  findAll(): [Socket, string | null][] {
    return Array.from(this.sessions.entries())
  }

  findOne(socket: Socket): string | null | undefined {
    return this.sessions.get(socket)
  }

  remove(socket: Socket): void {
    this.sessions.delete(socket)
  }

  findSocketByUserId(userId: string): Socket | undefined {
    const sessionsArray = this.findAll()

    const foundEntry = sessionsArray.find(([, id]) => id === userId)

    if (!foundEntry) return

    const [foundSocket] = foundEntry

    return foundSocket
  }
}
