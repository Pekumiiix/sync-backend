import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'auth.forgot_password.store': { paramsTuple?: []; params?: {} }
    'auth.reset_password.store': { paramsTuple?: []; params?: {} }
    'auth.verify_email.store': { paramsTuple?: []; params?: {} }
    'auth.verify_email.resend': { paramsTuple?: []; params?: {} }
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'folder.folders.store': { paramsTuple?: []; params?: {} }
    'folder.folders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder.folders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder.folders.index': { paramsTuple?: []; params?: {} }
    'folder.folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmarks.fetch': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmarks.store': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmarks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmarks.pin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmarks.unpin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmarks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'member.members.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'member.members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
    'member.members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
    'invitations.invitations.index': { paramsTuple?: []; params?: {} }
    'invitations.invitations.store': { paramsTuple?: []; params?: {} }
    'invitations.invitations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'invitations.invitations.accept': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folders.index': { paramsTuple?: []; params?: {} }
    'folder.folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'member.members.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'invitations.invitations.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folders.index': { paramsTuple?: []; params?: {} }
    'folder.folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'member.members.index': { paramsTuple: [ParamValue]; params: {'folderId': ParamValue} }
    'invitations.invitations.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.new_account.store': { paramsTuple?: []; params?: {} }
    'auth.access_tokens.store': { paramsTuple?: []; params?: {} }
    'auth.forgot_password.store': { paramsTuple?: []; params?: {} }
    'auth.reset_password.store': { paramsTuple?: []; params?: {} }
    'auth.verify_email.store': { paramsTuple?: []; params?: {} }
    'auth.verify_email.resend': { paramsTuple?: []; params?: {} }
    'profile.access_tokens.destroy': { paramsTuple?: []; params?: {} }
    'folder.folders.store': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmarks.fetch': { paramsTuple?: []; params?: {} }
    'bookmarks.bookmarks.store': { paramsTuple?: []; params?: {} }
    'invitations.invitations.store': { paramsTuple?: []; params?: {} }
    'invitations.invitations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'invitations.invitations.accept': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'profile.profile.update': { paramsTuple?: []; params?: {} }
    'folder.folders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmarks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmarks.pin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmarks.unpin': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'member.members.update': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
  }
  DELETE: {
    'folder.folders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmarks.bookmarks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'member.members.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'folderId': ParamValue,'memberId': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}