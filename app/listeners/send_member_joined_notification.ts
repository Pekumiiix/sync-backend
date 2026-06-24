import MemberJoined from '#events/member_joined'
import Member from '#models/member'
import Notification from '#models/notification'

export default class SendMemberJoinedNotification {
  async handle(event: MemberJoined) {
    const { folderId, actor } = event

    const members = await Member.query()
      .where('folderId', folderId)
      .whereNot('userId', actor.id)
      .preload('user')
      .preload('folder')

    if (members.length === 0) return

    const notificationsToInsert = []

    for (const member of members) {
      const userSettings = member.user.settings

      const wantsNotification = userSettings?.notifyOnNewMember ?? true

      if (wantsNotification) {
        notificationsToInsert.push({
          userId: member.userId,
          type: 'member_joined' as const,
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
    }

    if (notificationsToInsert.length > 0) {
      await Notification.createMany(notificationsToInsert)
    }
  }
}
