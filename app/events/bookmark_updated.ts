import type User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class BookmarkUpdated extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public actor: User,
    public folderId: string
  ) {
    super()
  }
}
