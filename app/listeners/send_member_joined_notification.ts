import type MemberJoined from '#events/member_joined'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'

export default class SendMemberJoinedNotification {
  async handle(event: MemberJoined) {
    const { folderId, actor } = event

    const members = await MemberService.getMembers(folderId, actor.id)

    await NotificationService.notifyMembers(members, actor, null, 'member_joined')
  }
}
