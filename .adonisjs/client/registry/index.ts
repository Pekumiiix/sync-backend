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
  'auth.forgot_password.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/forgot-password',
    tokens: [{"old":"/api/v1/auth/forgot-password","type":0,"val":"api","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['auth.forgot_password.store']['types'],
  },
  'auth.reset_password.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/reset-password',
    tokens: [{"old":"/api/v1/auth/reset-password","type":0,"val":"api","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"reset-password","end":""}],
    types: placeholder as Registry['auth.reset_password.store']['types'],
  },
  'auth.verify_email.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify-email',
    tokens: [{"old":"/api/v1/auth/verify-email","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify-email","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify-email","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify-email","type":0,"val":"verify-email","end":""}],
    types: placeholder as Registry['auth.verify_email.store']['types'],
  },
  'auth.verify_email.resend': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify-email/resend',
    tokens: [{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"verify-email","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"resend","end":""}],
    types: placeholder as Registry['auth.verify_email.resend']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/sign-out',
    tokens: [{"old":"/api/v1/account/sign-out","type":0,"val":"api","end":""},{"old":"/api/v1/account/sign-out","type":0,"val":"v1","end":""},{"old":"/api/v1/account/sign-out","type":0,"val":"account","end":""},{"old":"/api/v1/account/sign-out","type":0,"val":"sign-out","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
  'profile.profile.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.update']['types'],
  },
  'folder.folders.store': {
    methods: ["POST"],
    pattern: '/api/v1/folders',
    tokens: [{"old":"/api/v1/folders","type":0,"val":"api","end":""},{"old":"/api/v1/folders","type":0,"val":"v1","end":""},{"old":"/api/v1/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['folder.folders.store']['types'],
  },
  'folder.folders.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/folders/:id',
    tokens: [{"old":"/api/v1/folders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['folder.folders.destroy']['types'],
  },
  'folder.folders.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/folders/:id',
    tokens: [{"old":"/api/v1/folders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['folder.folders.update']['types'],
  },
  'folder.folders.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/folders',
    tokens: [{"old":"/api/v1/folders","type":0,"val":"api","end":""},{"old":"/api/v1/folders","type":0,"val":"v1","end":""},{"old":"/api/v1/folders","type":0,"val":"folders","end":""}],
    types: placeholder as Registry['folder.folders.index']['types'],
  },
  'folder.folders.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/folders/:id',
    tokens: [{"old":"/api/v1/folders/:id","type":0,"val":"api","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/folders/:id","type":0,"val":"folders","end":""},{"old":"/api/v1/folders/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['folder.folders.show']['types'],
  },
  'bookmarks.bookmarks.fetch': {
    methods: ["POST"],
    pattern: '/api/v1/bookmarks/preview',
    tokens: [{"old":"/api/v1/bookmarks/preview","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/preview","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/preview","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/preview","type":0,"val":"preview","end":""}],
    types: placeholder as Registry['bookmarks.bookmarks.fetch']['types'],
  },
  'bookmarks.bookmarks.store': {
    methods: ["POST"],
    pattern: '/api/v1/bookmarks',
    tokens: [{"old":"/api/v1/bookmarks","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks","type":0,"val":"bookmarks","end":""}],
    types: placeholder as Registry['bookmarks.bookmarks.store']['types'],
  },
  'bookmarks.bookmarks.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/bookmarks/:id',
    tokens: [{"old":"/api/v1/bookmarks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/:id","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['bookmarks.bookmarks.update']['types'],
  },
  'bookmarks.bookmarks.pin': {
    methods: ["PATCH"],
    pattern: '/api/v1/bookmarks/bookmarks/:id/pin',
    tokens: [{"old":"/api/v1/bookmarks/bookmarks/:id/pin","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/pin","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/pin","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/pin","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/pin","type":1,"val":"id","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/pin","type":0,"val":"pin","end":""}],
    types: placeholder as Registry['bookmarks.bookmarks.pin']['types'],
  },
  'bookmarks.bookmarks.unpin': {
    methods: ["PATCH"],
    pattern: '/api/v1/bookmarks/bookmarks/:id/unpin',
    tokens: [{"old":"/api/v1/bookmarks/bookmarks/:id/unpin","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/unpin","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/unpin","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/unpin","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/unpin","type":1,"val":"id","end":""},{"old":"/api/v1/bookmarks/bookmarks/:id/unpin","type":0,"val":"unpin","end":""}],
    types: placeholder as Registry['bookmarks.bookmarks.unpin']['types'],
  },
  'bookmarks.bookmarks.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/bookmarks/:id',
    tokens: [{"old":"/api/v1/bookmarks/:id","type":0,"val":"api","end":""},{"old":"/api/v1/bookmarks/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/bookmarks/:id","type":0,"val":"bookmarks","end":""},{"old":"/api/v1/bookmarks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['bookmarks.bookmarks.destroy']['types'],
  },
  'member.members.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/folder/:folderId/member',
    tokens: [{"old":"/api/v1/folder/:folderId/member","type":0,"val":"api","end":""},{"old":"/api/v1/folder/:folderId/member","type":0,"val":"v1","end":""},{"old":"/api/v1/folder/:folderId/member","type":0,"val":"folder","end":""},{"old":"/api/v1/folder/:folderId/member","type":1,"val":"folderId","end":""},{"old":"/api/v1/folder/:folderId/member","type":0,"val":"member","end":""}],
    types: placeholder as Registry['member.members.index']['types'],
  },
  'member.members.update': {
    methods: ["PATCH"],
    pattern: '/api/v1/folder/:folderId/member/:memberId',
    tokens: [{"old":"/api/v1/folder/:folderId/member/:memberId","type":0,"val":"api","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":0,"val":"v1","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":0,"val":"folder","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":1,"val":"folderId","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":0,"val":"member","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":1,"val":"memberId","end":""}],
    types: placeholder as Registry['member.members.update']['types'],
  },
  'member.members.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/folder/:folderId/member/:memberId',
    tokens: [{"old":"/api/v1/folder/:folderId/member/:memberId","type":0,"val":"api","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":0,"val":"v1","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":0,"val":"folder","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":1,"val":"folderId","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":0,"val":"member","end":""},{"old":"/api/v1/folder/:folderId/member/:memberId","type":1,"val":"memberId","end":""}],
    types: placeholder as Registry['member.members.destroy']['types'],
  },
  'invitations.invitations.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/invitations',
    tokens: [{"old":"/api/v1/invitations","type":0,"val":"api","end":""},{"old":"/api/v1/invitations","type":0,"val":"v1","end":""},{"old":"/api/v1/invitations","type":0,"val":"invitations","end":""}],
    types: placeholder as Registry['invitations.invitations.index']['types'],
  },
  'invitations.invitations.store': {
    methods: ["POST"],
    pattern: '/api/v1/invitations',
    tokens: [{"old":"/api/v1/invitations","type":0,"val":"api","end":""},{"old":"/api/v1/invitations","type":0,"val":"v1","end":""},{"old":"/api/v1/invitations","type":0,"val":"invitations","end":""}],
    types: placeholder as Registry['invitations.invitations.store']['types'],
  },
  'invitations.invitations.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/invitations/:id/decline',
    tokens: [{"old":"/api/v1/invitations/:id/decline","type":0,"val":"api","end":""},{"old":"/api/v1/invitations/:id/decline","type":0,"val":"v1","end":""},{"old":"/api/v1/invitations/:id/decline","type":0,"val":"invitations","end":""},{"old":"/api/v1/invitations/:id/decline","type":1,"val":"id","end":""},{"old":"/api/v1/invitations/:id/decline","type":0,"val":"decline","end":""}],
    types: placeholder as Registry['invitations.invitations.destroy']['types'],
  },
  'invitations.invitations.accept': {
    methods: ["POST"],
    pattern: '/api/v1/invitations/:id/accept',
    tokens: [{"old":"/api/v1/invitations/:id/accept","type":0,"val":"api","end":""},{"old":"/api/v1/invitations/:id/accept","type":0,"val":"v1","end":""},{"old":"/api/v1/invitations/:id/accept","type":0,"val":"invitations","end":""},{"old":"/api/v1/invitations/:id/accept","type":1,"val":"id","end":""},{"old":"/api/v1/invitations/:id/accept","type":0,"val":"accept","end":""}],
    types: placeholder as Registry['invitations.invitations.accept']['types'],
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
