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
  'auth.access_tokens.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/sign-in'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.forgot_passwords.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/forgot-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').forgotPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').forgotPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/forgot_passwords_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/forgot_passwords_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.reset_passwords.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/reset-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').resetPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').resetPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/reset_passwords_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/reset_passwords_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify_emails.store': {
    methods: ["POST"]
    pattern: '/api/v1/auth/verify-email'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').verifyEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').verifyEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/verify_emails_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/verify_emails_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify_emails.resend': {
    methods: ["POST"]
    pattern: '/api/v1/auth/verify-email/resend'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/verify_emails_controller').default['resend']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/verify_emails_controller').default['resend']>>>
    }
  }
  'oauths.googles.redirect': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/oauth/google'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/googles_controller').default['redirect']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/googles_controller').default['redirect']>>>
    }
  }
  'oauths.googles.store': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/oauth/google/callback'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/googles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/googles_controller').default['store']>>>
    }
  }
  'oauths.googles.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/oauth/google/disconnect'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/googles_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/oauth/googles_controller').default['destroy']>>>
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
  'profile.access_tokens.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/account/sign-out'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/auth/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/auth/access_tokens_controller').default['destroy']>>>
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
  'folder.folder.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/folders/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['destroy']>>>
    }
  }
  'folder.folder.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/folders/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/folder').updateFolderValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/folder').updateFolderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'folder.folder.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/folders/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/folder').getFolderParamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/folder_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
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
  'bookmarks.bookmark.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/bookmark').updateBookmarkValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/bookmark').updateBookmarkValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmark.pin': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/bookmarks/:id/pin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['pin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['pin']>>>
    }
  }
  'bookmarks.bookmark.unpin': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/bookmarks/:id/unpin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['unpin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['unpin']>>>
    }
  }
  'bookmarks.bookmark.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/bookmarks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/bookmark_controller').default['destroy']>>>
    }
  }
  'members.member.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/folder/:folderId/member'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { folderId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/member_controller').default['index']>>>
    }
  }
  'members.member.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/folder/:folderId/member/:memberId'
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
    pattern: '/api/v1/folder/:folderId/member/:memberId'
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
    methods: ["POST"]
    pattern: '/api/v1/invitations/:id/decline'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['destroy']>>>
    }
  }
  'invitations.invitation.accept': {
    methods: ["POST"]
    pattern: '/api/v1/invitations/:id/accept'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['accept']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/v_1/core/invitation_controller').default['accept']>>>
    }
  }
}
