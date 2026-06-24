import MemberRemoved from '#events/member_removed'
import Member from '#models/member'
import Notification from '#models/notification'

export default class SendMemberRemovedNotification {
  async handle(event: MemberRemoved) {
    const { folderId, actor, removedMemberFirstName } = event

    const members = await Member.query().where('folderId', folderId).preload('folder')

    if (members.length === 0) return

    const notificationsToInsert = []

    for (const member of members) {
      notificationsToInsert.push({
        userId: member.userId,
        type: 'member_removed' as const,
        data: {
          folderId: member.folder.id,
          folderName: member.folder.name,

          actorId: actor.id,
          actorName: actor.firstName,
          actorAvatar: actor.avatarUrl,

          targetName: removedMemberFirstName,
        },
      })
    }

    if (notificationsToInsert.length > 0) {
      await Notification.createMany(notificationsToInsert)
    }
  }
}
