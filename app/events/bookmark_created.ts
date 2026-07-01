import type User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class BookmarkCreated extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public creator: User,
    public folderId: string
  ) {
    super()
  }
}
