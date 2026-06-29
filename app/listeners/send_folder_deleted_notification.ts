import FolderDeleted from '#events/folder_deleted'
import { NotificationService } from '#services/notification_service'

export default class SendFolderDeletedNotification {
  async handle(event: FolderDeleted) {
    const { folderName, actor, members } = event

    await NotificationService.notifyMembers(members, actor, folderName, 'folder_deleted')
  }
}
