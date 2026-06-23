import { BaseTransformer } from '@adonisjs/core/transformers'
import Notification from '#models/notification'

export default class NotificationTransformer extends BaseTransformer<Notification> {
  toObject() {
    const baseData = this.pick(this.resource, ['id', 'type', 'createdAt'])

    const data = this.resource.data || {}

    const notificationText = formatNotificationContent(this.resource.type, data)

    return {
      ...baseData,
      actor: {
        actorName: this.resource.data.actorName,
        actorAvatar: this.resource.data.actorAvatar,
      },
      folder: {
        folderName: this.resource.data.folderName,
        folderId: this.resource.data.folderId,
      },
      isRead: this.resource.readAt !== null,
      message: notificationText.message,
      title: notificationText.title,
    }
  }
}

function formatNotificationContent(type: string, data: Record<string, any>) {
  const actor = data.actorName || 'Someone'
  const folder = data.folderName || 'a folder'

  const messages: Record<string, { title: string; message: string }> = {
    member_joined: {
      title: 'New member joined',
      message: `${actor} has joined ${folder}. Say hello and start collaborating!`,
    },
    member_left: {
      title: 'Member left',
      message: `${actor} has left ${folder}. You can still access their past contributions.`,
    },
    member_removed: {
      title: 'Member removed',
      message: `${actor} has been removed from ${folder}. They no longer have access to these resources.`,
    },
    new_bookmark: {
      title: 'New bookmark added',
      message: `${actor} added a new bookmark to ${folder}. Take a look to stay updated.`,
    },
    bookmark_updated: {
      title: 'Bookmark updated',
      message: `${actor} updated a bookmark in ${folder}. Check out the latest changes to ensure you're up to speed.`,
    },
    bookmark_deleted: {
      title: 'Bookmark deleted',
      message: `${actor} deleted a bookmark from ${folder}. This resource is no longer available to the team.`,
    },
  }

  return (
    messages[type] || {
      title: 'New Notification',
      message: 'You have a new notification.',
    }
  )
}
