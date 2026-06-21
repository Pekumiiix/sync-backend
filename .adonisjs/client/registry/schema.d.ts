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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/forgot_password_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/forgot_password_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reset_password_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reset_password_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/verify_email_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/verify_email_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify_email.resend': {
    methods: ["POST"]
    pattern: '/api/v1/auth/verify-email/resend'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/verify_email_controller').default['resend']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/verify_email_controller').default['resend']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/access_tokens_controller').default['destroy']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'folder.folders.store': {
    methods: ["POST"]
    pattern: '/api/v1/folders'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/folder').createFolderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/folder').createFolderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'folder.folders.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/folders/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['destroy']>>>
    }
  }
  'folder.folders.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/folders/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/folder').updateFolderValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/folder').updateFolderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'folder.folders.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/folders'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['index']>>>
    }
  }
  'folder.folders.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/folders/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/folder').getFolderParamValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/folders_controller').default['show']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmarks.fetch': {
    methods: ["POST"]
    pattern: '/api/v1/bookmarks/preview'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/bookmark').fetchUrlDataValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/bookmark').fetchUrlDataValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['fetch']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['fetch']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmarks.store': {
    methods: ["POST"]
    pattern: '/api/v1/bookmarks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/bookmark').createBookmarkValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/bookmark').createBookmarkValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmarks.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/bookmark').updateBookmarkValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/bookmark').updateBookmarkValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'bookmarks.bookmarks.pin': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/bookmarks/:id/pin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['pin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['pin']>>>
    }
  }
  'bookmarks.bookmarks.unpin': {
    methods: ["PATCH"]
    pattern: '/api/v1/bookmarks/bookmarks/:id/unpin'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['unpin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['unpin']>>>
    }
  }
  'bookmarks.bookmarks.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/bookmarks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/bookmarks_controller').default['destroy']>>>
    }
  }
  'member.members.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/folder/:folderId/member'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { folderId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['index']>>>
    }
  }
  'member.members.update': {
    methods: ["PATCH"]
    pattern: '/api/v1/folder/:folderId/member/:memberId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/member').updateMemberValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { folderId: ParamValue; memberId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/member').updateMemberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'member.members.destroy': {
    methods: ["DELETE"]
    pattern: '/api/v1/folder/:folderId/member/:memberId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { folderId: ParamValue; memberId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/members_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/members_controller').default['destroy']>>>
    }
  }
  'invitations.invitations.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/invitations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/invitations_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/invitations_controller').default['index']>>>
    }
  }
  'invitations.invitations.store': {
    methods: ["POST"]
    pattern: '/api/v1/invitations'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/invitation').storeInvitationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/invitation').storeInvitationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/invitations_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/invitations_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'invitations.invitations.destroy': {
    methods: ["POST"]
    pattern: '/api/v1/invitations/:id/decline'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/invitations_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/invitations_controller').default['destroy']>>>
    }
  }
  'invitations.invitations.accept': {
    methods: ["POST"]
    pattern: '/api/v1/invitations/:id/accept'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/invitations_controller').default['accept']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/invitations_controller').default['accept']>>>
    }
  }
}
