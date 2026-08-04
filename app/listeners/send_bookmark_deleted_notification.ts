import type BookmarkDeleted from '#events/bookmark_deleted'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SendBookmarkDeletedNotification {
  constructor(
    protected memberService: MemberService,
    protected notificationService: NotificationService
  ) {}

  async handle(event: BookmarkDeleted) {
    const { actor, folderId, bookmarkName } = event

    const members = await this.memberService.getMembers(folderId, actor.id)

    await this.notificationService.notifyMembers(members, actor, bookmarkName, 'bookmark_deleted')
  }
}
