import type User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class MemberJoined extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public folderId: string,
    public actor: User
  ) {
    super()
  }
}
