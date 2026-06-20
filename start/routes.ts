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
      .prefix('folder')
      .as('folder')
      .use(middleware.auth())

    router
      .group(() => {
        router.delete(':id', [controllers.Bookmarks, 'destroy'])
      })
      .prefix('bookmark')
      .as('bookmark')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
