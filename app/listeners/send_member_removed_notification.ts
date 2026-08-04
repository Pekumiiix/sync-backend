import type MemberRemoved from '#events/member_removed'
import { MemberService } from '#services/member_service'
import { NotificationService } from '#services/notification_service'
import { inject } from '@adonisjs/core'

@inject()
export default class SendMemberRemovedNotification {
  constructor(
    protected memberService: MemberService,
    protected notificationService: NotificationService
  ) {}

  async handle(event: MemberRemoved) {
    const { folderId, actor, removedMemberFirstName } = event

    const members = await this.memberService.getMembers(folderId, actor.id)

    await this.notificationService.notifyMembers(
      members,
      actor,
      removedMemberFirstName,
      'member_removed'
    )
  }
}
