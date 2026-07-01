/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.new_account.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/sign-up'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/sign-in'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/access_token_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/access_token_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.access_token.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/auth/sign-out'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/access_token_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/access_token_controller').default['destroy']>>>
    }
  }
  'auth.forgot_password.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/forgot-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').forgotPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').forgotPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/forgot_password_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/forgot_password_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.reset_password.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/reset-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').resetPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').resetPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/reset_password_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/reset_password_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify_email.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/verify-email'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').verifyEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').verifyEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/verify_email_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/verify_email_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify_email.resend': {
    methods: ["POST"]
    pattern: '/api/v1/auth/verify-email/resend'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').resendVerificationEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').resendVerificationEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/verify_email_controller').default['resend']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/verify_email_controller').default['resend']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'extension.auth.store': {
    methods: ["POST"]
    pattern: '/api/v1/extension/sign-in'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/extension_user').extensionLoginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/extension_user').extensionLoginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/extension/auth_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/extension/auth_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'oauths.google.redirect': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/oauth/google'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/google_controller').default['redirect']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/google_controller').default['redirect']>>>
    }
  }
  'oauths.google.store': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/oauth/google/callback'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/google_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/google_controller').default['store']>>>
    }
  }
  'oauths.google.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/oauth/google/disconnect'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/google_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/google_controller').default['destroy']>>>
    }
  }
  'profile.profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/users/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/users/profile_controller').default['show']>>>
    }
  }
  'profile.profile.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/account/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/users/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/users/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'folder.folder.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/folders'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['index']>>>
    }
  }
  'folder.folder.store': {
    methods: ["POST"]
    pattern: '/api/v1/folders'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/folder').createFolderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/folder').createFolderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'folder.folder.join': {
    methods: ["POST"]
    pattern: '/api/v1/folders/:folderId/join'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/folder').joinFolderValidator)>>
      paramsTuple: [ParamValue]
      params: { folderId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/folder').joinFolderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['join']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['join']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'folder.folder.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/folders/:folderId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { folderId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['destroy']>>>
    }
  }
  'folder.folder.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/folders/:folderId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/folder').updateFolderValidator)>>
      paramsTuple: [ParamValue]
      params: { folderId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/folder').updateFolderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'folder.folder.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/folders/:folderId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { folderId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/bookmark').getBookmarksQueryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmark.store': {
    methods: ["POST"]
    pattern: '/api/v1/bookmarks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/bookmark').createBookmarkValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/bookmark').createBookmarkValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmark.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/bookmarks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/bookmark').getBookmarksQueryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmark.fetch': {
    methods: ["POST"]
    pattern: '/api/v1/bookmarks/preview'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/bookmark').fetchUrlDataValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/bookmark').fetchUrlDataValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['fetch']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['fetch']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmark.browsers': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/bookmarks/browsers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['browsers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['browsers']>>>
    }
  }
  'bookmarks.bookmark.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/:bookmarkId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/bookmark').updateBookmarkValidator)>>
      paramsTuple: [ParamValue]
      params: { bookmarkId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/bookmark').updateBookmarkValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmark.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/bookmarks/:bookmarkId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { bookmarkId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['destroy']>>>
    }
  }
  'bookmarks.bookmark.pin': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/:bookmarkId/pin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { bookmarkId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['pin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['pin']>>>
    }
  }
  'bookmarks.bookmark.unpin': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/:bookmarkId/unpin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { bookmarkId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['unpin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['unpin']>>>
    }
  }
  'bookmarks.bookmark.move': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/:bookmarkId/move'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/bookmark').moveBookmarkValidator)>>
      paramsTuple: [ParamValue]
      params: { bookmarkId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/bookmark').moveBookmarkValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['move']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['move']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'members.member.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/folders/:folderId/member'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { folderId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['index']>>>
    }
  }
  'members.member.leave': {
    methods: ["DELETE"]
    pattern: '/api/v1/folders/:folderId/member/leave'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { folderId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['leave']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['leave']>>>
    }
  }
  'members.member.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/folders/:folderId/member/:memberId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/member').updateMemberValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { folderId: ParamValue; memberId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/member').updateMemberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'members.member.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/folders/:folderId/member/:memberId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { folderId: ParamValue; memberId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['destroy']>>>
    }
  }
  'invitations.invitation.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/invitations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['index']>>>
    }
  }
  'invitations.invitation.store': {
    methods: ["POST"]
    pattern: '/api/v1/invitations'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/invitation').storeInvitationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/invitation').storeInvitationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'invitations.invitation.destroy': {
    methods: ["PATCH"]
    pattern: '/api/v1/invitations/:invitationId/decline'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { invitationId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['destroy']>>>
    }
  }
  'invitations.invitation.accept': {
    methods: ["PATCH"]
    pattern: '/api/v1/invitations/:invitationId/accept'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { invitationId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['accept']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['accept']>>>
    }
  }
  'notifications.notification.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/notification').notificationQueryParam)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'notifications.notification.destroy_all': {
    methods: ["DELETE"]
    pattern: '/api/v1/notifications'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['destroyAll']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['destroyAll']>>>
    }
  }
  'notifications.notification.mark_all_as_read': {
    methods: ["PATCH"]
    pattern: '/api/v1/notifications/mark-all-as-read'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['markAllAsRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['markAllAsRead']>>>
    }
  }
  'notifications.notification.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/notifications/:notificationId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { notificationId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['destroy']>>>
    }
  }
  'notifications.notification.mark_as_read': {
    methods: ["PATCH"]
    pattern: '/api/v1/notifications/:notificationId/read'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { notificationId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['markAsRead']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['markAsRead']>>>
    }
  }
  'notifications.notification.mark_as_unread': {
    methods: ["PATCH"]
    pattern: '/api/v1/notifications/:notificationId/unread'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { notificationId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['markAsUnread']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/users/notification_controller').default['markAsUnread']>>>
    }
  }
  'browserIntegrations.integration.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/browser-integrations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/integration_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/integration_controller').default['index']>>>
    }
  }
  'browserIntegrations.integration.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/browser-integrations/:integrationId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { integrationId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/integration_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/integration_controller').default['destroy']>>>
    }
  }
}
