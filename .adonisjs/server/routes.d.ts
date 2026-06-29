import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.store': { paramsTuple?: []; params?: {} }
    'auth.reset_passwords.store': { paramsTuple?: []; params?: {} }
    'auth.verify_emails.store': { paramsTuple?: []; params?: {} }
    'auth.verify_emails.resend': { paramsTuple?: []; params?: {} }
    'oauths.googles.redirect': { paramsTuple?: []; params?: {} }
    'oauths.googles.store': { paramsTuple?: []; params?: {} }
    'oauths.googles.destroy': { paramsTuple?: []; params?: {} }
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
    'notifications.notifications.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.destroy_all': { paramsTuple?: []; params?: {} }
    'notifications.notifications.mark_all_as_read': { paramsTuple?: []; params?: {} }
    'notifications.notifications.destroy': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
    'notifications.notifications.mark_as_read': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
    'notifications.notifications.mark_as_unread': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
  }
  GET: {
    'oauths.googles.redirect': { paramsTuple?: []; params?: {} }
    'oauths.googles.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folder.index': { paramsTuple?: []; params?: {} }
    'folder.folder.show': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.index': { paramsTuple?: []; params?: {} }
    'members.member.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'invitations.invitation.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'oauths.googles.redirect': { paramsTuple?: []; params?: {} }
    'oauths.googles.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folder.index': { paramsTuple?: []; params?: {} }
    'folder.folder.show': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.index': { paramsTuple?: []; params?: {} }
    'members.member.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'invitations.invitation.index': { paramsTuple?: []; params?: {} }
    'notifications.notifications.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.store': { paramsTuple?: []; params?: {} }
    'auth.reset_passwords.store': { paramsTuple?: []; params?: {} }
    'auth.verify_emails.store': { paramsTuple?: []; params?: {} }
    'auth.verify_emails.resend': { paramsTuple?: []; params?: {} }
    'folder.folder.store': { paramsTuple?: []; params?: {} }
    'folder.folder.join': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.store': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmark.fetch': { paramsTuple?: []; params?: {} }
    'invitations.invitation.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'oauths.googles.destroy': { paramsTuple?: []; params?: {} }
    'folder.folder.destroy': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'bookmarks.bookmark.destroy': { paramsTuple: [ParamValue]; params: {'bookmarkId': ParamValue} }
    'members.member.leave': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'members.member.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
    'notifications.notifications.destroy_all': { paramsTuple?: []; params?: {} }
    'notifications.notifications.destroy': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
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
    'notifications.notifications.mark_all_as_read': { paramsTuple?: []; params?: {} }
    'notifications.notifications.mark_as_read': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
    'notifications.notifications.mark_as_unread': { paramsTuple: [ParamValue]; params: {'notificationId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}