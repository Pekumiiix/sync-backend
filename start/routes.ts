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
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.scalar('/swagger') // .ui('/swagger', swagger) or .rapidoc('/swagger')
})

router
  .group(() => {
    router
      .group(() => {
        router.post('sign-up', [controllers.v1.auth.NewAccount, 'store'])
        router.post('sign-in', [controllers.v1.auth.AccessTokens, 'store'])
        router.post('forgot-password', [controllers.v1.auth.ForgotPasswords, 'store'])
        router.post('reset-password', [controllers.v1.auth.ResetPasswords, 'store'])
        router.post('verify-email', [controllers.v1.auth.VerifyEmails, 'store'])
        router.post('verify-email/resend', [controllers.v1.auth.VerifyEmails, 'resend'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('google', [controllers.v1.oauth.Googles, 'redirect'])
        router.get('google/callback', [controllers.v1.oauth.Googles, 'store'])
        router
          .delete('google/disconnect', [controllers.v1.oauth.Googles, 'destroy'])
          .use(middleware.auth())
      })
      .prefix('oauth')
      .as('oauths')

    router
      .group(() => {
        router.get('profile', [controllers.v1.users.Profile, 'show'])
        router.post('sign-out', [controllers.v1.auth.AccessTokens, 'destroy'])
        router.patch('profile', [controllers.v1.users.Profile, 'update'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/', [controllers.v1.core.Folder, 'store'])
        router.delete(':id', [controllers.v1.core.Folder, 'destroy'])
        router.patch(':id', [controllers.v1.core.Folder, 'update'])
        router.get('/', [controllers.v1.core.Folder, 'index'])
        router.get(':id', [controllers.v1.core.Folder, 'show'])
      })
      .prefix('folders')
      .as('folder')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('preview', [controllers.v1.core.Bookmark, 'fetch'])
        router.post('/', [controllers.v1.core.Bookmark, 'store'])
        router.patch(':id', [controllers.v1.core.Bookmark, 'update'])
        router.patch('bookmarks/:id/pin', [controllers.v1.core.Bookmark, 'pin'])
        router.patch('bookmarks/:id/unpin', [controllers.v1.core.Bookmark, 'unpin'])
        router.delete(':id', [controllers.v1.core.Bookmark, 'destroy'])
      })
      .prefix('bookmarks')
      .as('bookmarks')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.v1.core.Member, 'index'])
        router.patch(':memberId', [controllers.v1.core.Member, 'update'])
        router.delete(':memberId', [controllers.v1.core.Member, 'destroy'])
      })
      .prefix('/folder/:folderId/member')
      .as('members')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.v1.core.Invitation, 'index'])
        router.post('/', [controllers.v1.core.Invitation, 'store'])
        router.post(':id/decline', [controllers.v1.core.Invitation, 'destroy'])
        router.post(':id/accept', [controllers.v1.core.Invitation, 'accept'])
      })
      .prefix('invitations')
      .as('invitations')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
