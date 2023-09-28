import { SessionsService } from '@/session/session.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

export class AuthModule {
  private authService: AuthService
  private authController: AuthController

  constructor(private sessionsService: SessionsService) {
    this.authService = new AuthService(this.sessionsService)
    this.authController = new AuthController(this.authService)
  }

  getController(): AuthController {
    return this.authController
  }
}
