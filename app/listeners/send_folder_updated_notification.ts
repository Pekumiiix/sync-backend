import FolderUpdated from '#events/folder_updated'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'

export default class SendFolderUpdatedNotification {
  async handle(event: FolderUpdated) {
    const { actor, folderId, folderName } = event

    const members = await MemberService.getMembers(folderId, actor.id)

    await NotificationService.notifyMembers(members, actor, folderName, 'folder_updated')
  }
}
