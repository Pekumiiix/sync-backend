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
        router.post('sign-up', [controllers.NewAccount, 'store'])
        router.post('sign-in', [controllers.AccessTokens, 'store'])
        router.post('forgot-password', [controllers.ForgotPassword, 'store'])
        router.post('reset-password', [controllers.ResetPassword, 'store'])
        router.post('verify-email', [controllers.VerifyEmail, 'store'])
        router.post('verify-email/resend', [controllers.VerifyEmail, 'resend'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('sign-out', [controllers.AccessTokens, 'destroy'])
        router.patch('profile', [controllers.Profile, 'update'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('/', [controllers.Folders, 'store'])
        router.delete(':id', [controllers.Folders, 'destroy'])
        router.patch(':id', [controllers.Folders, 'update'])
        router.get('/', [controllers.Folders, 'index'])
        router.get(':id', [controllers.Folders, 'show'])
      })
      .prefix('folders')
      .as('folder')
      .use(middleware.auth())

    router
      .group(() => {
        router.post('preview', [controllers.Bookmarks, 'fetch'])
        router.post('/', [controllers.Bookmarks, 'store'])
        router.patch(':id', [controllers.Bookmarks, 'update'])
        router.patch('bookmarks/:id/pin', [controllers.Bookmarks, 'pin'])
        router.patch('bookmarks/:id/unpin', [controllers.Bookmarks, 'unpin'])
        router.delete(':id', [controllers.Bookmarks, 'destroy'])
      })
      .prefix('bookmarks')
      .as('bookmarks')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Members, 'index'])
        router.patch(':memberId', [controllers.Members, 'update'])
        router.delete(':memberId', [controllers.Members, 'destroy'])
      })
      .prefix('/folder/:folderId/member')
      .as('member')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [controllers.Invitations, 'index'])
        router.post('/', [controllers.Invitations, 'store'])
        router.post(':id/decline', [controllers.Invitations, 'destroy'])
        router.post(':id/accept', [controllers.Invitations, 'accept'])
      })
      .prefix('invitations')
      .as('invitations')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
