import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.store': { paramsTuple?: []; params?: {} }
    'auth.reset_passwords.store': { paramsTuple?: []; params?: {} }
    'auth.verify_emails.store': { paramsTuple?: []; params?: {} }
    'auth.verify_emails.resend': { paramsTuple?: []; params?: {} }
    'oauths.googles.redirect': { paramsTuple?: []; params?: {} }
    'oauths.googles.store': { paramsTuple?: []; params?: {} }
    'oauths.googles.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'folder.folder.store': { paramsTuple?: []; params?: {} }
    'folder.folder.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder.folder.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder.folder.index': { paramsTuple?: []; params?: {} }
    'folder.folder.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmark.fetch': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmark.store': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmark.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmark.pin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmark.unpin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmark.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'members.member.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'members.member.update': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
    'members.member.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
    'invitations.invitation.index': { paramsTuple?: []; params?: {} }
    'invitations.invitation.store': { paramsTuple?: []; params?: {} }
    'invitations.invitation.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'invitations.invitation.accept': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'oauths.googles.redirect': { paramsTuple?: []; params?: {} }
    'oauths.googles.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folder.index': { paramsTuple?: []; params?: {} }
    'folder.folder.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'members.member.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'invitations.invitation.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'oauths.googles.redirect': { paramsTuple?: []; params?: {} }
    'oauths.googles.store': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folder.index': { paramsTuple?: []; params?: {} }
    'folder.folder.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'members.member.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'invitations.invitation.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'auth.forgot_passwords.store': { paramsTuple?: []; params?: {} }
    'auth.reset_passwords.store': { paramsTuple?: []; params?: {} }
    'auth.verify_emails.store': { paramsTuple?: []; params?: {} }
    'auth.verify_emails.resend': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'folder.folder.store': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmark.fetch': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmark.store': { paramsTuple?: []; params?: {} }
    'invitations.invitation.store': { paramsTuple?: []; params?: {} }
    'invitations.invitation.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'invitations.invitation.accept': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'oauths.googles.destroy': { paramsTuple?: []; params?: {} }
    'folder.folder.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmark.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'members.member.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
  }
  PATCH: {
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'folder.folder.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmark.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmark.pin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmark.unpin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'members.member.update': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}