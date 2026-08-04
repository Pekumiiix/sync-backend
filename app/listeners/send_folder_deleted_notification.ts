import type FolderDeleted from '#events/folder_deleted'
import { NotificationService } from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SendFolderDeletedNotification {
  constructor(protected notificationService: NotificationService) {}

  async handle(event: FolderDeleted) {
    const { folderName, actor, members } = event

    await this.notificationService.notifyMembers(members, actor, folderName, 'folder_deleted')
  }
}
