import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'auth.forgot_password.store': { paramsTuple?: []; params?: {} }
    'auth.reset_password.store': { paramsTuple?: []; params?: {} }
    'auth.verify_email.store': { paramsTuple?: []; params?: {} }
    'auth.verify_email.resend': { paramsTuple?: []; params?: {} }
    'extension.auth.store': { paramsTuple?: []; params?: {} }
    'oauths.google.redirect': { paramsTuple?: []; params?: {} }
    'oauths.google.store': { paramsTuple?: []; params?: {} }
    'oauths.google.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'folder.folder.index': { paramsTuple?: []; params?: {} }
    'folder.folder.store': { paramsTuple?: []; params?: {} }
    'folder.folder.join': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'folder.folder.destroy': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'folder.folder.update': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'folder.folder.show': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.store': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmark.index': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmark.fetch': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmark.update': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'bookmarks.bookmark.destroy': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'bookmarks.bookmark.pin': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'bookmarks.bookmark.unpin': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'bookmarks.bookmark.move': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'members.member.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'members.member.leave': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'members.member.update': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
    'members.member.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
    'invitations.invitation.index': { paramsTuple?: []; params?: {} }
    'invitations.invitation.store': { paramsTuple?: []; params?: {} }
    'invitations.invitation.destroy': { paramsTuple: [ParamValue]; params: {'invitationId': ParamValue} }
    'invitations.invitation.accept': { paramsTuple: [ParamValue]; params: {'invitationId': ParamValue} }
    'notifications.notification.index': { paramsTuple?: []; params?: {} }
    'notifications.notification.destroy_all': { paramsTuple?: []; params?: {} }
    'notifications.notification.mark_all_as_read': { paramsTuple?: []; params?: {} }
    'notifications.notification.destroy': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
    'notifications.notification.mark_as_read': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
    'notifications.notification.mark_as_unread': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
    'browserIntegrations.integration.index': { paramsTuple?: []; params?: {} }
    'browserIntegrations.integration.destroy': { paramsTuple: [ParamValue]; params: {'integrationId': ParamValue} }
  }
  GET: {
    'oauths.google.redirect': { paramsTuple?: []; params?: {} }
    'oauths.google.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folder.index': { paramsTuple?: []; params?: {} }
    'folder.folder.show': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.index': { paramsTuple?: []; params?: {} }
    'members.member.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'invitations.invitation.index': { paramsTuple?: []; params?: {} }
    'notifications.notification.index': { paramsTuple?: []; params?: {} }
    'browserIntegrations.integration.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'oauths.google.redirect': { paramsTuple?: []; params?: {} }
    'oauths.google.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folder.index': { paramsTuple?: []; params?: {} }
    'folder.folder.show': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.index': { paramsTuple?: []; params?: {} }
    'members.member.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'invitations.invitation.index': { paramsTuple?: []; params?: {} }
    'notifications.notification.index': { paramsTuple?: []; params?: {} }
    'browserIntegrations.integration.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.store': { paramsTuple?: []; params?: {} }
    'auth.access_token.destroy': { paramsTuple?: []; params?: {} }
    'auth.forgot_password.store': { paramsTuple?: []; params?: {} }
    'auth.reset_password.store': { paramsTuple?: []; params?: {} }
    'auth.verify_email.store': { paramsTuple?: []; params?: {} }
    'auth.verify_email.resend': { paramsTuple?: []; params?: {} }
    'extension.auth.store': { paramsTuple?: []; params?: {} }
    'folder.folder.store': { paramsTuple?: []; params?: {} }
    'folder.folder.join': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.store': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmark.fetch': { paramsTuple?: []; params?: {} }
    'invitations.invitation.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'oauths.google.destroy': { paramsTuple?: []; params?: {} }
    'folder.folder.destroy': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.destroy': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'members.member.leave': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'members.member.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
    'notifications.notification.destroy_all': { paramsTuple?: []; params?: {} }
    'notifications.notification.destroy': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
    'browserIntegrations.integration.destroy': { paramsTuple: [ParamValue]; params: {'integrationId': ParamValue} }
  }
  PATCH: {
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'folder.folder.update': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.update': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'bookmarks.bookmark.pin': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'bookmarks.bookmark.unpin': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'bookmarks.bookmark.move': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'members.member.update': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
    'invitations.invitation.destroy': { paramsTuple: [ParamValue]; params: {'invitationId': ParamValue} }
    'invitations.invitation.accept': { paramsTuple: [ParamValue]; params: {'invitationId': ParamValue} }
    'notifications.notification.mark_all_as_read': { paramsTuple?: []; params?: {} }
    'notifications.notification.mark_as_read': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
    'notifications.notification.mark_as_unread': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}