import type MemberLeft from '#events/member_left'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SendMemberLeftNotification {
  constructor(
    protected memberService: MemberService,
    protected notificationService: NotificationService
  ) {}

  async handle(event: MemberLeft) {
    const { folderId, actor } = event

    const members = await this.memberService.getMembers(folderId, actor.id)

    await this.notificationService.notifyMembers(members, actor, null, 'member_left')
  }
}
