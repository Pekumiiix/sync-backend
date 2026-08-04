import type BookmarkUpdated from '#events/bookmark_updated'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SendBookmarkUpdatedNotification {
  constructor(
    protected memberService: MemberService,
    protected notificationService: NotificationService
  ) {}

  async handle(event: BookmarkUpdated) {
    const { actor, folderId } = event

    const members = await this.memberService.getMembers(folderId, actor.id)

    await this.notificationService.notifyMembers(members, actor, null, 'bookmark_updated')
  }
}
