import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'
import { events } from '#generated/events'
import { listeners } from '#generated/listeners'

// User events
emitter.on(events.UserRegistered, listeners.SendVerificationEmail)
emitter.on(events.UserRegistered, listeners.CreateDefaultFolders)

// Folder events
emitter.on(events.FolderCreated, listeners.AssignFolderOwner)

// Bookmark events
emitter.on(events.BookmarkCreated, listeners.SendBookmarkCreatedNotification)

// Password reset events
emitter.on(events.PasswordResetRequested, listeners.SendPasswordResetEmail)

// Notification events
emitter.on(events.MemberLeft, listeners.SendMemberLeftNotification)
emitter.on(events.MemberJoined, listeners.SendMemberJoinedNotification)
emitter.on(events.MemberRemoved, listeners.SendMemberRemovedNotification)
emitter.on(events.BookmarkUpdated, listeners.SendBookmarkUpdatedNotification)
emitter.on(events.BookmarkDeleted, listeners.SendBookmarkDeletedNotification)
emitter.on(events.FolderUpdated, listeners.SendFolderUpdatedNotification)
emitter.on(events.FolderDeleted, listeners.SendFolderDeletedNotification)

emitter.onError((event, error, data) => {
  logger.error({ err: error, event, eventData: data }, 'An event listener failed in the background')
})
