import BookmarkCreated from '#events/bookmark_created'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'

export default class SendBookmarkCreatedNotification {
  async handle(event: BookmarkCreated) {
    const { creator, folderId } = event

    const members = await MemberService.getMembers(folderId, creator.id)

    await NotificationService.notifyMembers(members, creator, null, 'new_bookmark')
  }
}
