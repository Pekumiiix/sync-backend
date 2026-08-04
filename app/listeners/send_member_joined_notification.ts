import type MemberJoined from '#events/member_joined'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SendMemberJoinedNotification {
  constructor(
    protected memberService: MemberService,
    protected notificationService: NotificationService
  ) {}

  async handle(event: MemberJoined) {
    const { folderId, actor } = event

    const members = await this.memberService.getMembers(folderId, actor.id)

    await this.notificationService.notifyMembers(members, actor, null, 'member_joined')
  }
}
