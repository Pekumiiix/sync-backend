/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router
      .group(() => {
        router
          .post('sign-up', [controllers.v1.auth.NewAccount, 'store'])
          .openapi({ summary: 'Create a new user account' })
        router
          .post('sign-in', [controllers.v1.auth.AccessTokens, 'store'])
          .openapi({ summary: 'Sign in a user and generate an access token' })
        router
          .post('forgot-password', [controllers.v1.auth.ForgotPasswords, 'store'])
          .openapi({ summary: 'Request a password reset' })
        router
          .post('reset-password', [controllers.v1.auth.ResetPasswords, 'store'])
          .openapi({ summary: 'Reset user password' })
        router
          .post('verify-email', [controllers.v1.auth.VerifyEmails, 'store'])
          .openapi({ summary: 'Verify user email' })
        router
          .post('verify-email/resend', [controllers.v1.auth.VerifyEmails, 'resend'])
          .openapi({ summary: 'Resend email verification link' })
      })
      .prefix('auth')
      .as('auth')
      .openapi({
        tags: ['Authentication'],
        description: 'Authentication related endpoints',
      })

    router
      .group(() => {
        router
          .get('google', [controllers.v1.oauth.Googles, 'redirect'])
          .openapi({ summary: 'Redirect to Google OAuth' })
        router
          .get('google/callback', [controllers.v1.oauth.Googles, 'store'])
          .openapi({ summary: 'Handle Google OAuth callback' })
        router
          .delete('google/disconnect', [controllers.v1.oauth.Googles, 'destroy'])
          .openapi({ summary: 'Disconnect Google OAuth' })
          .use(middleware.auth())
      })
      .prefix('oauth')
      .as('oauths')
      .openapi({
        tags: ['OAuth'],
        description: 'OAuth related endpoints',
      })

    router
      .group(() => {
        router
          .get('profile', [controllers.v1.users.Profile, 'show'])
          .openapi({ summary: 'Get user profile' })
        router
          .post('sign-out', [controllers.v1.auth.AccessTokens, 'destroy'])
          .openapi({ summary: 'Sign out the user' })
        router
          .patch('profile', [controllers.v1.users.Profile, 'update'])
          .openapi({ summary: 'Update user profile' })
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
      .openapi({
        tags: ['User Account'],
        description: 'User account related endpoints',
      })

    router
      .group(() => {
        router
          .get('/', [controllers.v1.core.Folder, 'index'])
          .openapi({ summary: 'List all folders' })
        router
          .post('/', [controllers.v1.core.Folder, 'store'])
          .openapi({ summary: 'Create a new folder' })

        router
          .post(':folderId/join', [controllers.v1.core.Folder, 'join'])
          .openapi({ summary: 'Join a folder' })

        router
          .delete(':folderId', [controllers.v1.core.Folder, 'destroy'])
          .openapi({ summary: 'Delete a folder' })
        router
          .patch(':folderId', [controllers.v1.core.Folder, 'update'])
          .openapi({ summary: 'Update folder details' })
        router
          .get(':folderId', [controllers.v1.core.Folder, 'show'])
          .openapi({ summary: 'Get folder details' })
      })
      .prefix('folders')
      .as('folder')
      .use(middleware.auth())
      .openapi({
        tags: ['Folders'],
        description: 'Folder related endpoints',
      })

    router
      .group(() => {
        router
          .post('/', [controllers.v1.core.Bookmark, 'store'])
          .openapi({ summary: 'Add a new bookmark' })

        router
          .post('preview', [controllers.v1.core.Bookmark, 'fetch'])
          .openapi({ summary: 'Fetch bookmark preview data' })

        router
          .patch(':bookmarkId', [controllers.v1.core.Bookmark, 'update'])
          .openapi({ summary: 'Update a bookmark' })
        router
          .delete(':bookmarkId', [controllers.v1.core.Bookmark, 'destroy'])
          .openapi({ summary: 'Delete a bookmark' })
        router
          .patch(':bookmarkId/pin', [controllers.v1.core.Bookmark, 'pin'])
          .openapi({ summary: 'Pin a bookmark' })
        router
          .patch(':bookmarkId/unpin', [controllers.v1.core.Bookmark, 'unpin'])
          .openapi({ summary: 'Unpin a bookmark' })
      })
      .prefix('bookmarks')
      .as('bookmarks')
      .use(middleware.auth())
      .openapi({
        tags: ['Bookmarks'],
        description: 'Bookmark related endpoints',
      })

    router
      .group(() => {
        router
          .get('/', [controllers.v1.core.Member, 'index'])
          .openapi({ summary: 'List all members' })

        router
          .delete('/leave', [controllers.v1.core.Member, 'leave'])
          .openapi({ summary: 'Leave a folder' })

        router
          .patch(':memberId', [controllers.v1.core.Member, 'update'])
          .openapi({ summary: 'Update a member' })
        router
          .delete(':memberId', [controllers.v1.core.Member, 'destroy'])
          .openapi({ summary: 'Remove a member' })
      })
      .prefix('/folder/:folderId/member')
      .as('members')
      .use(middleware.auth())
      .openapi({
        tags: ['Members'],
        description: 'Folder member related endpoints',
      })

    router
      .group(() => {
        router
          .get('/', [controllers.v1.core.Invitation, 'index'])
          .openapi({ summary: 'List all invitations' })
        router
          .post('/', [controllers.v1.core.Invitation, 'store'])
          .openapi({ summary: 'Create a new invitation' })

        router
          .post(':invitationId/decline', [controllers.v1.core.Invitation, 'destroy'])
          .openapi({ summary: 'Decline an invitation' })
        router
          .post(':invitationId/accept', [controllers.v1.core.Invitation, 'accept'])
          .openapi({ summary: 'Accept an invitation' })
      })
      .prefix('invitations')
      .as('invitations')
      .use(middleware.auth())
      .openapi({
        tags: ['Invitations'],
        description: 'Folder invitation related endpoints',
      })

    router
      .group(() => {
        router
          .get('/', [controllers.v1.users.Notifications, 'index'])
          .openapi({ summary: 'List all notifications' })

        router
          .patch('mark-all-read', [controllers.v1.users.Notifications, 'markAllAsRead'])
          .openapi({ summary: 'Mark all notifications as read' })

        router
          .delete(':notificationId', [controllers.v1.users.Notifications, 'destroy'])
          .openapi({ summary: 'Delete a notification' })
        router
          .patch(':notificationId/read', [controllers.v1.users.Notifications, 'markAsRead'])
          .openapi({ summary: 'Mark a notification as read' })
        router
          .patch(':notificationId/unread', [controllers.v1.users.Notifications, 'markAsUnread'])
          .openapi({ summary: 'Mark a notification as unread' })
      })
      .prefix('notifications')
      .as('notifications')
      .use(middleware.auth())
      .openapi({
        tags: ['Notifications'],
        description: 'Notification related endpoints',
      })
  })
  .prefix('/api/v1')
