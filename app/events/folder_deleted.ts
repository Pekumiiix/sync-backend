import type Member from '#models/member'
import type User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class FolderDeleted extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public folderName: string,
    public actor: User,
    public members: Member[]
  ) {
    super()
  }
}
