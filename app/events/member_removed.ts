import type User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class MemberRemoved extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public actor: User,
    public folderId: string,
    public removedMemberFirstName: string,
    public removedMemberId: string
  ) {
    super()
  }
}
