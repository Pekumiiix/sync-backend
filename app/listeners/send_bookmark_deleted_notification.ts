import type BookmarkDeleted from '#events/bookmark_deleted'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'

export default class SendBookmarkDeletedNotification {
  async handle(event: BookmarkDeleted) {
    const { actor, folderId, bookmarkName } = event

    const members = await MemberService.getMembers(folderId, actor.id)

    await NotificationService.notifyMembers(members, actor, bookmarkName, 'bookmark_deleted')
  }
}
