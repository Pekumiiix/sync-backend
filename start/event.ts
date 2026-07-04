import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'
import { events } from '#generated/events'
import { listeners } from '#generated/listeners'

// User events
emitter.listen(events.UserRegistered, [listeners.SendVerificationEmail])

// Bookmark events
emitter.listen(events.BookmarkCreated, [listeners.SendBookmarkCreatedNotification])

// Password reset events
emitter.listen(events.PasswordResetRequested, [listeners.SendPasswordResetEmail])

// Notification events
emitter.listen(events.MemberLeft, [listeners.SendMemberLeftNotification])
emitter.listen(events.MemberJoined, [listeners.SendMemberJoinedNotification])
emitter.listen(events.MemberRemoved, [listeners.SendMemberRemovedNotification])
emitter.listen(events.BookmarkUpdated, [listeners.SendBookmarkUpdatedNotification])
emitter.listen(events.BookmarkDeleted, [listeners.SendBookmarkDeletedNotification])
emitter.listen(events.FolderUpdated, [listeners.SendFolderUpdatedNotification])
emitter.listen(events.FolderDeleted, [listeners.SendFolderDeletedNotification])

emitter.onError((event, error, data) => {
  logger.error({ err: error, event, eventData: data }, 'An event listener failed in the background')
})
