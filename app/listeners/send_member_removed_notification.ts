import type MemberRemoved from '#events/member_removed'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'

export default class SendMemberRemovedNotification {
  async handle(event: MemberRemoved) {
    const { folderId, actor, removedMemberFirstName } = event

    const members = await MemberService.getMembers(folderId, actor.id)

    await NotificationService.notifyMembers(
      members,
      actor,
      removedMemberFirstName,
      'member_removed'
    )
  }
}
