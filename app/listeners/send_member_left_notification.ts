import MemberLeft from '#events/member_left'
import Member from '#models/member'
import Notification from '#models/notification'

export default class SendMemberLeftNotification {
  async handle(event: MemberLeft) {
    const { folderId, actor } = event

    const members = await Member.query()
      .where('folderId', folderId)
      .whereNot('userId', actor.id)
      .preload('folder')

    if (members.length === 0) return

    const notificationsToInsert = []

    for (const member of members) {
      notificationsToInsert.push({
        userId: member.userId,
        type: 'member_left' as const,
        data: {
          folderId: member.folder.id,
          folderName: member.folder.name,

          actorId: actor.id,
          actorName: actor.firstName,
          actorAvatar: actor.avatarUrl,

          targetName: null,
        },
      })
    }

    if (notificationsToInsert.length > 0) {
      await Notification.createMany(notificationsToInsert)
    }
  }
}
