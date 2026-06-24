import BookmarkCreated from '#events/bookmark_created'
import Member from '#models/member'
import Notification from '#models/notification'

export default class SendBookmarkCreatedNotification {
  async handle(event: BookmarkCreated) {
    const { creator, folderId } = event

    const members = await Member.query()
      .where('folderId', folderId)
      .whereNot('userId', creator.id)
      .preload('user')
      .preload('folder')

    if (members.length === 0) return

    const notificationsToInsert = []

    for (const member of members) {
      const userSettings = member.user.settings

      const wantsNotification = userSettings?.notifyOnNewBookmark ?? true

      if (wantsNotification) {
        notificationsToInsert.push({
          userId: member.userId,
          type: 'new_bookmark' as const,
          data: {
            folderId: member.folder.id,
            folderName: member.folder.name,

            actorId: creator.id,
            actorName: creator.firstName,
            actorAvatar: creator.avatarUrl,

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
