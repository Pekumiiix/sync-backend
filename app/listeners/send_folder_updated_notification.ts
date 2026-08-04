import type FolderUpdated from '#events/folder_updated'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SendFolderUpdatedNotification {
  constructor(
    protected memberService: MemberService,
    protected notificationService: NotificationService
  ) {}

  async handle(event: FolderUpdated) {
    const { actor, folderId, folderName } = event

    const members = await this.memberService.getMembers(folderId, actor.id)

    await this.notificationService.notifyMembers(members, actor, folderName, 'folder_updated')
  }
}
