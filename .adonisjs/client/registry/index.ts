/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/sign-up',
    tokens: [{"old":"/api/v1/auth/sign-up","type":0,"val":"api","end":""},{"old":"/api/v1/auth/sign-up","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/sign-up","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/sign-up","type":0,"val":"sign-up","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/sign-in',
    tokens: [{"old":"/api/v1/auth/sign-in","type":0,"val":"api","end":""},{"old":"/api/v1/auth/sign-in","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/sign-in","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/sign-in","type":0,"val":"sign-in","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'auth.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/auth/sign-out',
    tokens: [{"old":"/api/v1/auth/sign-out","type":0,"val":"api","end":""},{"old":"/api/v1/auth/sign-out","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/sign-out","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/sign-out","type":0,"val":"sign-out","end":""}],
    types: placeholder as Registry['auth.access_tokens.destroy']['types'],
  },
  'auth.forgot_passwords.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/forgot-password',
    tokens: [{"old":"/api/v1/auth/forgot-password","type":0,"val":"api","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['auth.forgot_passwords.store']['types'],
  },
  'auth.reset_passwords.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/reset-password',
    tokens: [{"old":"/api/v1/auth/reset-password","type":0,"val":"api","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"reset-password","end":""}],
    types: placeholder as Registry['auth.reset_passwords.store']['types'],
  },
  'auth.verify_emails.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify-email',
    tokens: [{"old":"/api/v1/auth/verify-email","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify-email","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify-email","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify-email","type":0,"val":"verify-email","end":""}],
    types: placeholder as Registry['auth.verify_emails.store']['types'],
  },
  'auth.verify_emails.resend': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify-email/resend',
    tokens: [{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"verify-email","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"resend","end":""}],
    types: placeholder as Registry['auth.verify_emails.resend']['types'],
  },
  'oauths.googles.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/oauth/google',
    tokens: [{"old":"/api/v1/oauth/google","type":0,"val":"api","end":""},{"old":"/api/v1/oauth/google","type":0,"val":"v1","end":""},{"old":"/api/v1/oauth/google","type":0,"val":"oauth","end":""},{"old":"/api/v1/oauth/google","type":0,"val":"google","end":""}],
    types: placeholder as Registry['oauths.googles.redirect']['types'],
  },
  'oauths.googles.store': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/oauth/google/callback',
    tokens: [{"old":"/api/v1/oauth/google/callback","type":0,"val":"api","end":""},{"old":"/api/v1/oauth/google/callback","type":0,"val":"v1","end":""},{"old":"/api/v1/oauth/google/callback","type":0,"val":"oauth","end":""},{"old":"/api/v1/oauth/google/callback","type":0,"val":"google","end":""},{"old":"/api/v1/oauth/google/callback","type":0,"val":"callback","end":""}],
    types: placeholder as Registry['oauths.googles.store']['types'],
  },
  'oauths.googles.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/oauth/google/disconnect',
    tokens: [{"old":"/api/v1/oauth/google/disconnect","type":0,"val":"api","end":""},{"old":"/api/v1/oauth/google/disconnect","type":0,"val":"v1","end":""},{"old":"/api/v1/oauth/google/disconnect","type":0,"val":"oauth","end":""},{"old":"/api/v1/oauth/google/disconnect","type":0,"val":"google","end":""},{"old":"/api/v1/oauth/google/disconnect","type":0,"val":"disconnect","end":""}],
    types: placeholder as Registry['oauths.googles.destroy']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.profile.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.update']['types'],
  },
  'folder.folder.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/folders',
    tokens: [{"old":"/api/v1/folders","type":0,"val":"api","end":""},{"old":"/api/v1/folders","type":0,"val":"v1","end":""},{"old":"/api/v1/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['folder.folder.index']['types'],
  },
  'folder.folder.store': {
    methods: ["POST"],
    pattern: '/api/v1/folders',
    tokens: [{"old":"/api/v1/folders","type":0,"val":"api","end":""},{"old":"/api/v1/folders","type":0,"val":"v1","end":""},{"old":"/api/v1/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['folder.folder.store']['types'],
  },
  'folder.folder.join': {
    methods: ["POST"],
    pattern: '/api/v1/folders/:folderId/join',
    tokens: [{"old":"/api/v1/folders/:folderId/join","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:folderId/join","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:folderId/join","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:folderId/join","type":1,"val":"folderId","end":""},{"old":"/api/v1/folders/:folderId/join","type":0,"val":"join","end":""}],
    types: placeholder as Registry['folder.folder.join']['types'],
  },
  'folder.folder.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/folders/:folderId',
    tokens: [{"old":"/api/v1/folders/:folderId","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:folderId","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:folderId","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:folderId","type":1,"val":"folderId","end":""}],
    types: placeholder as Registry['folder.folder.destroy']['types'],
  },
  'folder.folder.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/folders/:folderId',
    tokens: [{"old":"/api/v1/folders/:folderId","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:folderId","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:folderId","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:folderId","type":1,"val":"folderId","end":""}],
    types: placeholder as Registry['folder.folder.update']['types'],
  },
  'folder.folder.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/folders/:folderId',
    tokens: [{"old":"/api/v1/folders/:folderId","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:folderId","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:folderId","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:folderId","type":1,"val":"folderId","end":""}],
    types: placeholder as Registry['folder.folder.show']['types'],
  },
  'bookmarks.bookmark.store': {
    methods: ["POST"],
    pattern: '/api/v1/bookmarks',
    tokens: [{"old":"/api/v1/bookmarks","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks","type":0,"val":"bookmarks","end":""}],
    types: placeholder as Registry['bookmarks.bookmark.store']['types'],
  },
  'bookmarks.bookmark.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/bookmarks',
    tokens: [{"old":"/api/v1/bookmarks","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks","type":0,"val":"bookmarks","end":""}],
    types: placeholder as Registry['bookmarks.bookmark.index']['types'],
  },
  'bookmarks.bookmark.fetch': {
    methods: ["POST"],
    pattern: '/api/v1/bookmarks/preview',
    tokens: [{"old":"/api/v1/bookmarks/preview","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/preview","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/preview","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/preview","type":0,"val":"preview","end":""}],
    types: placeholder as Registry['bookmarks.bookmark.fetch']['types'],
  },
  'bookmarks.bookmark.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/bookmarks/:bookmarkId',
    tokens: [{"old":"/api/v1/bookmarks/:bookmarkId","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/:bookmarkId","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/:bookmarkId","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/:bookmarkId","type":1,"val":"bookmarkId","end":""}],
    types: placeholder as Registry['bookmarks.bookmark.update']['types'],
  },
  'bookmarks.bookmark.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/bookmarks/:bookmarkId',
    tokens: [{"old":"/api/v1/bookmarks/:bookmarkId","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/:bookmarkId","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/:bookmarkId","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/:bookmarkId","type":1,"val":"bookmarkId","end":""}],
    types: placeholder as Registry['bookmarks.bookmark.destroy']['types'],
  },
  'bookmarks.bookmark.pin': {
    methods: ["PATCH"],
    pattern: '/api/v1/bookmarks/:bookmarkId/pin',
    tokens: [{"old":"/api/v1/bookmarks/:bookmarkId/pin","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/pin","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/pin","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/pin","type":1,"val":"bookmarkId","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/pin","type":0,"val":"pin","end":""}],
    types: placeholder as Registry['bookmarks.bookmark.pin']['types'],
  },
  'bookmarks.bookmark.unpin': {
    methods: ["PATCH"],
    pattern: '/api/v1/bookmarks/:bookmarkId/unpin',
    tokens: [{"old":"/api/v1/bookmarks/:bookmarkId/unpin","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/unpin","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/unpin","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/unpin","type":1,"val":"bookmarkId","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/unpin","type":0,"val":"unpin","end":""}],
    types: placeholder as Registry['bookmarks.bookmark.unpin']['types'],
  },
  'bookmarks.bookmark.move': {
    methods: ["PATCH"],
    pattern: '/api/v1/bookmarks/:bookmarkId/move',
    tokens: [{"old":"/api/v1/bookmarks/:bookmarkId/move","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/move","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/move","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/move","type":1,"val":"bookmarkId","end":""},{"old":"/api/v1/bookmarks/:bookmarkId/move","type":0,"val":"move","end":""}],
    types: placeholder as Registry['bookmarks.bookmark.move']['types'],
  },
  'members.member.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/folders/:folderId/member',
    tokens: [{"old":"/api/v1/folders/:folderId/member","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:folderId/member","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:folderId/member","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:folderId/member","type":1,"val":"folderId","end":""},{"old":"/api/v1/folders/:folderId/member","type":0,"val":"member","end":""}],
    types: placeholder as Registry['members.member.index']['types'],
  },
  'members.member.leave': {
    methods: ["DELETE"],
    pattern: '/api/v1/folders/:folderId/member/leave',
    tokens: [{"old":"/api/v1/folders/:folderId/member/leave","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:folderId/member/leave","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:folderId/member/leave","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:folderId/member/leave","type":1,"val":"folderId","end":""},{"old":"/api/v1/folders/:folderId/member/leave","type":0,"val":"member","end":""},{"old":"/api/v1/folders/:folderId/member/leave","type":0,"val":"leave","end":""}],
    types: placeholder as Registry['members.member.leave']['types'],
  },
  'members.member.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/folders/:folderId/member/:memberId',
    tokens: [{"old":"/api/v1/folders/:folderId/member/:memberId","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":1,"val":"folderId","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":0,"val":"member","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":1,"val":"memberId","end":""}],
    types: placeholder as Registry['members.member.update']['types'],
  },
  'members.member.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/folders/:folderId/member/:memberId',
    tokens: [{"old":"/api/v1/folders/:folderId/member/:memberId","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":1,"val":"folderId","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":0,"val":"member","end":""},{"old":"/api/v1/folders/:folderId/member/:memberId","type":1,"val":"memberId","end":""}],
    types: placeholder as Registry['members.member.destroy']['types'],
  },
  'invitations.invitation.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/invitations',
    tokens: [{"old":"/api/v1/invitations","type":0,"val":"api","end":""},{"old":"/api/v1/invitations","type":0,"val":"v1","end":""},{"old":"/api/v1/invitations","type":0,"val":"invitations","end":""}],
    types: placeholder as Registry['invitations.invitation.index']['types'],
  },
  'invitations.invitation.store': {
    methods: ["POST"],
    pattern: '/api/v1/invitations',
    tokens: [{"old":"/api/v1/invitations","type":0,"val":"api","end":""},{"old":"/api/v1/invitations","type":0,"val":"v1","end":""},{"old":"/api/v1/invitations","type":0,"val":"invitations","end":""}],
    types: placeholder as Registry['invitations.invitation.store']['types'],
  },
  'invitations.invitation.destroy': {
    methods: ["PATCH"],
    pattern: '/api/v1/invitations/:invitationId/decline',
    tokens: [{"old":"/api/v1/invitations/:invitationId/decline","type":0,"val":"api","end":""},{"old":"/api/v1/invitations/:invitationId/decline","type":0,"val":"v1","end":""},{"old":"/api/v1/invitations/:invitationId/decline","type":0,"val":"invitations","end":""},{"old":"/api/v1/invitations/:invitationId/decline","type":1,"val":"invitationId","end":""},{"old":"/api/v1/invitations/:invitationId/decline","type":0,"val":"decline","end":""}],
    types: placeholder as Registry['invitations.invitation.destroy']['types'],
  },
  'invitations.invitation.accept': {
    methods: ["PATCH"],
    pattern: '/api/v1/invitations/:invitationId/accept',
    tokens: [{"old":"/api/v1/invitations/:invitationId/accept","type":0,"val":"api","end":""},{"old":"/api/v1/invitations/:invitationId/accept","type":0,"val":"v1","end":""},{"old":"/api/v1/invitations/:invitationId/accept","type":0,"val":"invitations","end":""},{"old":"/api/v1/invitations/:invitationId/accept","type":1,"val":"invitationId","end":""},{"old":"/api/v1/invitations/:invitationId/accept","type":0,"val":"accept","end":""}],
    types: placeholder as Registry['invitations.invitation.accept']['types'],
  },
  'notifications.notifications.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/notifications',
    tokens: [{"old":"/api/v1/notifications","type":0,"val":"api","end":""},{"old":"/api/v1/notifications","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications","type":0,"val":"notifications","end":""}],
    types: placeholder as Registry['notifications.notifications.index']['types'],
  },
  'notifications.notifications.destroy_all': {
    methods: ["DELETE"],
    pattern: '/api/v1/notifications',
    tokens: [{"old":"/api/v1/notifications","type":0,"val":"api","end":""},{"old":"/api/v1/notifications","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications","type":0,"val":"notifications","end":""}],
    types: placeholder as Registry['notifications.notifications.destroy_all']['types'],
  },
  'notifications.notifications.mark_all_as_read': {
    methods: ["PATCH"],
    pattern: '/api/v1/notifications/mark-all-as-read',
    tokens: [{"old":"/api/v1/notifications/mark-all-as-read","type":0,"val":"api","end":""},{"old":"/api/v1/notifications/mark-all-as-read","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications/mark-all-as-read","type":0,"val":"notifications","end":""},{"old":"/api/v1/notifications/mark-all-as-read","type":0,"val":"mark-all-as-read","end":""}],
    types: placeholder as Registry['notifications.notifications.mark_all_as_read']['types'],
  },
  'notifications.notifications.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/notifications/:notificationId',
    tokens: [{"old":"/api/v1/notifications/:notificationId","type":0,"val":"api","end":""},{"old":"/api/v1/notifications/:notificationId","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications/:notificationId","type":0,"val":"notifications","end":""},{"old":"/api/v1/notifications/:notificationId","type":1,"val":"notificationId","end":""}],
    types: placeholder as Registry['notifications.notifications.destroy']['types'],
  },
  'notifications.notifications.mark_as_read': {
    methods: ["PATCH"],
    pattern: '/api/v1/notifications/:notificationId/read',
    tokens: [{"old":"/api/v1/notifications/:notificationId/read","type":0,"val":"api","end":""},{"old":"/api/v1/notifications/:notificationId/read","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications/:notificationId/read","type":0,"val":"notifications","end":""},{"old":"/api/v1/notifications/:notificationId/read","type":1,"val":"notificationId","end":""},{"old":"/api/v1/notifications/:notificationId/read","type":0,"val":"read","end":""}],
    types: placeholder as Registry['notifications.notifications.mark_as_read']['types'],
  },
  'notifications.notifications.mark_as_unread': {
    methods: ["PATCH"],
    pattern: '/api/v1/notifications/:notificationId/unread',
    tokens: [{"old":"/api/v1/notifications/:notificationId/unread","type":0,"val":"api","end":""},{"old":"/api/v1/notifications/:notificationId/unread","type":0,"val":"v1","end":""},{"old":"/api/v1/notifications/:notificationId/unread","type":0,"val":"notifications","end":""},{"old":"/api/v1/notifications/:notificationId/unread","type":1,"val":"notificationId","end":""},{"old":"/api/v1/notifications/:notificationId/unread","type":0,"val":"unread","end":""}],
    types: placeholder as Registry['notifications.notifications.mark_as_unread']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
