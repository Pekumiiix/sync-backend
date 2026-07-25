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
import { authThrottle, resendThrottle, searchThrottle, throttle } from '#start/limiter'

router
  .group(() => {
    // Authentication routes
    router
      .group(() => {
        router
          .post('sign-up', [controllers.v1.auth.NewAccount, 'store'])
          .use(authThrottle)
          .use(middleware.guest())
          .openapi({ summary: 'Create a new user account' })
        router
          .post('sign-in', [controllers.v1.auth.AccessToken, 'store'])
          .use(authThrottle)
          .use(middleware.guest())
          .openapi({ summary: 'Sign in a user and generate an access token' })
        router
          .post('sign-out', [controllers.v1.auth.AccessToken, 'destroy'])
          .use(throttle)
          .use(middleware.auth())
          .openapi({ summary: 'Sign out the user' })
        router
          .post('forgot-password', [controllers.v1.auth.ForgotPassword, 'store'])
          .use(authThrottle)
          .use(middleware.guest())
          .openapi({ summary: 'Request a password reset' })
        router
          .post('reset-password', [controllers.v1.auth.ResetPassword, 'store'])
          .use(authThrottle)
          .use(middleware.guest())
          .openapi({ summary: 'Reset user password' })
        router
          .post('verify-email', [controllers.v1.auth.VerifyEmail, 'store'])
          .use(authThrottle)
          .openapi({ summary: 'Verify user email' })
        router
          .post('verify-email/resend', [controllers.v1.auth.VerifyEmail, 'resend'])
          .use(resendThrottle)
          .use(middleware.auth())
          .openapi({ summary: 'Resend email verification link' })
      })
      .prefix('auth')
      .as('auth')
      .openapi({
        tags: ['Authentication'],
        description: 'Authentication related endpoints',
      })

    // Extension routes
    router
      .group(() => {
        router
          .post('sign-in', [controllers.v1.extension.Auth, 'store'])
          .openapi({ summary: 'Login via browser extension' })
          .use(authThrottle)
          .use(middleware.guest())
        router
          .post('sync', [controllers.v1.extension.Bookmark, 'store'])
          .use(middleware.auth())
          .openapi({
            summary: 'Add bookmarks via browser extension',
          })
      })
      .prefix('extension')
      .as('extension')
      .openapi({
        tags: ['Extension'],
        description: 'Browser extension related endpoints',
      })

    // OAuth routes
    router
      .group(() => {
        router
          .get('google', [controllers.v1.oauth.Google, 'redirect'])
          .use(middleware.guest())
          .use(authThrottle)
          .openapi({ summary: 'Redirect to Google OAuth' })
        router
          .get('google/callback', [controllers.v1.oauth.Google, 'store'])
          .use(middleware.guest())
          .use(authThrottle)
          .openapi({ summary: 'Handle Google OAuth callback' })
        router
          .delete('google/disconnect', [controllers.v1.oauth.Google, 'destroy'])
          .openapi({ summary: 'Disconnect Google OAuth' })
          .use(middleware.auth())
      })
      .prefix('oauth')
      .as('oauths')
      .openapi({
        tags: ['OAuth'],
        description: 'OAuth related endpoints',
      })

    // Account routes
    router
      .group(() => {
        router
          .get('profile', [controllers.v1.users.Profile, 'show'])
          .openapi({ summary: 'Get user profile' })
        router
          .patch('profile', [controllers.v1.users.Profile, 'update'])
          .openapi({ summary: 'Update user profile' })
        router
          .patch('settings', [controllers.v1.users.Profile, 'updateSettings'])
          .openapi({ summary: 'Update user settings' })
      })
      .prefix('account')
      .as('profile')
      .use(throttle)
      .use(middleware.auth())
      .openapi({
        tags: ['User Account'],
        description: 'User account related endpoints',
      })

    // Folder routes
    router
      .group(() => {
        router
          .get('/', [controllers.v1.core.Folder, 'index'])
          .openapi({ summary: 'List all folders' })
        router
          .post('/', [controllers.v1.core.Folder, 'store'])
          .openapi({ summary: 'Create a new folder' })

        router
          .delete(':folderId', [controllers.v1.core.Folder, 'destroy'])
          .openapi({ summary: 'Delete a folder' })
        router
          .patch(':folderId', [controllers.v1.core.Folder, 'update'])
          .openapi({ summary: 'Update folder details' })
        router
          .get(':folderId', [controllers.v1.core.Folder, 'show'])
          .openapi({ summary: 'Get folder details' })

        router
          .post(':folderId/join', [controllers.v1.core.Folder, 'join'])
          .openapi({ summary: 'Join a folder' })
        router
          .patch(':folderId/password', [controllers.v1.core.Folder, 'addPassword'])
          .openapi({ summary: 'Add or update a folder password' })
        router
          .delete(':folderId/password', [controllers.v1.core.Folder, 'removePassword'])
          .openapi({
            summary: 'Remove a folder password',
          })
      })
      .prefix('folders')
      .as('folder')
      .use(throttle)
      .use(middleware.auth())
      .openapi({
        tags: ['Folders'],
        description: 'Folder related endpoints',
      })

    // Bookmark routes
    router
      .group(() => {
        router
          .post('/', [controllers.v1.core.Bookmark, 'store'])
          .openapi({ summary: 'Add a new bookmark' })
        router
          .get('/', [controllers.v1.core.Bookmark, 'index'])
          .openapi({ summary: 'List all bookmarks' })

        router
          .post('preview', [controllers.v1.core.Bookmark, 'preview'])
          .openapi({ summary: 'Fetch bookmark preview data' })
        router
          .get('browsers', [controllers.v1.core.Bookmark, 'browsers'])
          .openapi({ summary: "List unique browsers used in a user or folder's bookmarks" })
        router
          .patch('unpin', [controllers.v1.core.Bookmark, 'bulkUnpin'])
          .openapi({ summary: 'Unpin multiple bookmarks' })
        router
          .patch('move', [controllers.v1.core.Bookmark, 'bulkMove'])
          .openapi({ summary: 'Move multiple bookmarks to a different folder' })
        router
          .delete('delete', [controllers.v1.core.Bookmark, 'bulkDestroy'])
          .openapi({ summary: 'Delete multiple bookmarks' })

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
        router
          .patch(':bookmarkId/move', [controllers.v1.core.Bookmark, 'move'])
          .openapi({ summary: 'Move a bookmark to a different folder' })
      })
      .prefix('bookmarks')
      .as('bookmarks')
      .use(throttle)
      .use(middleware.auth())
      .openapi({
        tags: ['Bookmarks'],
        description: 'Bookmark related endpoints',
      })

    // Member routes
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
      .prefix('/folders/:folderId/members')
      .as('members')
      .use(throttle)
      .use(middleware.auth())
      .openapi({
        tags: ['Members'],
        description: 'Folder member related endpoints',
      })

    // Invitation routes
    router
      .group(() => {
        router
          .get('/', [controllers.v1.core.Invitation, 'index'])
          .openapi({ summary: 'List all invitations' })
        router
          .post('/', [controllers.v1.core.Invitation, 'store'])
          .openapi({ summary: 'Create a new invitation' })

        router
          .patch(':token/decline', [controllers.v1.core.Invitation, 'destroy'])
          .openapi({ summary: 'Decline an invitation' })
        router
          .patch(':token/accept', [controllers.v1.core.Invitation, 'accept'])
          .openapi({ summary: 'Accept an invitation' })
      })
      .prefix('invitations')
      .as('invitations')
      .use(throttle)
      .use(middleware.auth())
      .openapi({
        tags: ['Invitations'],
        description: 'Folder invitation related endpoints',
      })

    // Notification routes
    router
      .group(() => {
        router
          .get('/', [controllers.v1.users.Notification, 'index'])
          .openapi({ summary: 'List all notifications' })
        router
          .delete('/', [controllers.v1.users.Notification, 'destroyAll'])
          .openapi({ summary: 'Delete all notifications' })
        router
          .patch('mark-all-as-read', [controllers.v1.users.Notification, 'markAllAsRead'])
          .openapi({ summary: 'Mark all notifications as read' })

        router
          .delete(':notificationId', [controllers.v1.users.Notification, 'destroy'])
          .openapi({ summary: 'Delete a notification' })
        router
          .patch(':notificationId/read', [controllers.v1.users.Notification, 'markAsRead'])
          .openapi({ summary: 'Mark a notification as read' })
        router
          .patch(':notificationId/unread', [controllers.v1.users.Notification, 'markAsUnread'])
          .openapi({ summary: 'Mark a notification as unread' })
      })
      .prefix('notifications')
      .as('notifications')
      .use(throttle)
      .use(middleware.auth())
      .openapi({
        tags: ['Notifications'],
        description: 'Notification related endpoints',
      })

    // Browser Integration routes
    router
      .group(() => {
        router
          .get('/', [controllers.v1.core.Integration, 'index'])
          .openapi({ summary: 'List all browser integrations' })
        router

        router
          .delete('/:integrationId', [controllers.v1.core.Integration, 'destroy'])
          .openapi({ summary: 'Remove a browser integration' })
      })
      .prefix('browser-integrations')
      .as('browserIntegrations')
      .use(throttle)
      .use(middleware.auth())
      .openapi({
        tags: ['Browser Integrations'],
        description: 'Browser integration related endpoints',
      })

    // Search routes
    router
      .group(() => {
        router
          .get('bookmarks', [controllers.v1.core.Search, 'index'])
          .openapi({ summary: 'Search bookmarks' })
        router
          .get('/:folderId', [controllers.v1.core.Search, 'folderSearch'])
          .openapi({ summary: 'Search bookmarks in a specific folder' })
      })
      .prefix('search')
      .as('search')
      .use(searchThrottle)
      .use(middleware.auth())
      .openapi({
        tags: ['Search'],
        description: 'Search related endpoints',
      })
  })
  .prefix('/api/v1')
