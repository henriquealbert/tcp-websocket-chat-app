import { Socket } from 'net'
import { SessionsService } from '@/session/session.service'
import { Router } from '@/router'

export class AppService {
  constructor(
    private socket: Socket,
    private sessionsService: SessionsService,
    private router: Router
  ) {
    this.socket.on('data', this.handleData)
    this.socket.on('end', this.handleEnd)
    this.socket.on('close', this.handleClose)
    this.socket.on('error', this.handleError)
  }

  handleData = async (data: Buffer) => {
    const request = data.toString('utf8').trim()
    console.info('Received:', request)

    await this.router.handleRequest(this.socket, request)
  }

  handleEnd = () => {
    console.info('Client disconnected.')
  }

  handleClose = () => {
    console.info('Client connection closed.')
    this.sessionsService.remove(this.socket)
  }

  handleError = (error: Error) => {
    console.error('Error occurred:', error.message)

    if (!this.socket.destroyed) {
      this.socket.write(error.message)
      this.socket.end()
    }
  }
}
