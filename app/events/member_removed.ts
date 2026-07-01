import type User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class MemberRemoved extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public folderId: string,
    public removedMemberFirstName: string,
    public actor: User
  ) {
    super()
  }
}
