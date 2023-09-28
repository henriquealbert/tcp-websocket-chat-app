import net from 'net'
import { AppModule } from '@/app.module'
import { SessionsService } from './session/session.service'

const PORT = 3000

const sessionsService = new SessionsService()
const server = net.createServer((socket) => {
  sessionsService.create(socket, null)
  new AppModule(socket, sessionsService)
})

server.listen(PORT, () => {
  console.log(`TCP echo server is running on port ${PORT}`)
})

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
