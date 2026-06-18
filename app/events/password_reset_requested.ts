import User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class PasswordResetRequested extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public user: User,
    public resetToken: string
  ) {
    super()
  }
}
