import type BookmarkCreated from '#events/bookmark_created'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SendBookmarkCreatedNotification {
  constructor(
    protected memberService: MemberService,
    protected notificationService: NotificationService
  ) {}

  async handle(event: BookmarkCreated) {
    const { creator, folderId } = event

    const members = await this.memberService.getMembers(folderId, creator.id)

    await this.notificationService.notifyMembers(members, creator, null, 'new_bookmark')
  }
}
