import Folder from '#models/folder'
import User from '#models/user'
import { BaseEvent } from '@adonisjs/core/events'

export default class FolderCreated extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(
    public folder: Folder,
    public user: User
  ) {
    super()
  }
}
