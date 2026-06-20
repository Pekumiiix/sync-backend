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
    'folder.folders.store': { paramsTuple?: []; params?: {} }
    'folder.folders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder.folders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'folder.folders.index': { paramsTuple?: []; params?: {} }
    'folder.folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmark.bookmarks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folders.index': { paramsTuple?: []; params?: {} }
    'folder.folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.profile.show': { paramsTuple?: []; params?: {} }
    'folder.folders.index': { paramsTuple?: []; params?: {} }
    'folder.folders.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
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
  }
  DELETE: {
    'folder.folders.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bookmark.bookmarks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'folder.folders.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}