import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { apiError } from '#utils/response'
import OauthIdentity from '#models/o_auth_identity'
import UserTransformer from '#transformers/user_transformer'

export default class OauthsController {
  /**
   * @redirect
   * @operationId redirectGoogle
   * @summary Redirect to Google OAuth
   * @description Initiates the Google OAuth 2.0 login flow. Note: This endpoint does not return a JSON payload. It returns a 302 status code that redirects the client directly to the Google consent screen.
   * @response 302 - Redirects to the Google authentication page.
   */
  async redirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  /**
   * @store
   * @operationId handleGoogleCallback
   * @summary Google OAuth Callback
   * @description Handles the redirect back from Google OAuth. It verifies the Google user, creates or links their account, and returns an access token for API authentication.
   * @responseBody 200 - { "success": true, "message": "Logged in successfully", "data": "<AuthStoreData>" }
   * @responseBody 400 - <ApiErrorResponse> - Bad Request
   * @responseBody 401 - <ApiErrorResponse> - Unauthorized
   */
  async store(ctx: HttpContext) {
    const { response, ally } = ctx

    const google = ally.use('google')

    if (google.accessDenied()) {
      return response.unauthorized(apiError('Access to Google account was denied'))
    }
    if (google.stateMisMatch() || google.hasError()) {
      return response.badRequest(apiError('Login failed, please try again'))
    }

    const googleUser = await google.user()

    let user = await User.query()
      .whereHas('oauthIdentities', (query) => {
        query.where('provider', 'google').where('providerId', googleUser.id)
      })
      .first()

    if (!user) {
      user = await User.findBy('email', googleUser.email)

      if (!user) {
        user = await User.create({
          email: googleUser.email,
          firstName: googleUser.name.split(' ')[0],
          lastName: googleUser.name.split(' ').slice(1).join(' '),
          isEmailVerified: true,
        })
      }

      await OauthIdentity.create({
        userId: user.id,
        provider: 'google',
        providerId: googleUser.id,
        accessToken: googleUser.token.token,
      })
    }

    const token = await User.accessTokens.create(user)

    const formatedResponse = ctx.serialize(
      {
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      },
      'Logged in successfully'
    )

    return response.ok(formatedResponse)
  }

  /**
   * @destroy
   * @operationId disconnectGoogle
   * @security BearerAuth
   * @summary Disconnect Google Account
   * @description Removes the Google OAuth connection from the authenticated user's account. Will fail if the user has no password and this is their only login method.
   * @responseBody 200 - { "success": true, "message": "Google account disconnected successfully.", "data": "null" }
   * @responseBody 400 - <ApiErrorResponse> - Bad Request
   * @responseBody 401 - <ApiErrorResponse> - Unauthorized
   * @responseBody 404 - <ApiErrorResponse>
   */
  async destroy(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user! as User

    await user.load('oauthIdentities')

    if (!user.password && user.oauthIdentities.length <= 1) {
      return response.badRequest(
        apiError(
          'Cannot disconnect Google account. No other authentication method available. Please set a password before disconnecting.'
        )
      )
    }

    const identity = await OauthIdentity.query()
      .where('userId', user.id)
      .where('provider', 'google')
      .first()

    if (!identity) {
      return response.notFound(apiError('Google account not connected.'))
    }

    await identity.delete()

    const formatedResponse = ctx.serialize(null, 'Google account disconnected successfully.')

    return response.ok(formatedResponse)
  }
}
