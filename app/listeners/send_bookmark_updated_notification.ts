import type BookmarkUpdated from '#events/bookmark_updated'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'

export default class SendBookmarkUpdatedNotification {
  async handle(event: BookmarkUpdated) {
    const { actor, folderId } = event

    const members = await MemberService.getMembers(folderId, actor.id)

    await NotificationService.notifyMembers(members, actor, null, 'bookmark_updated')
  }
}
