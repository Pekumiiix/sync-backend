import type MemberLeft from '#events/member_left'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'

export default class SendMemberLeftNotification {
  async handle(event: MemberLeft) {
    const { folderId, actor } = event

    const members = await MemberService.getMembers(folderId, actor.id)

    await NotificationService.notifyMembers(members, actor, null, 'member_left')
  }
}
