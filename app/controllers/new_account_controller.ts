import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { generateVerificationCode } from '../utils/string.ts'
import UserTransformer from '#transformers/user_transformer'
import { events } from '#generated/events'

export default class NewAccountController {
  /**
   * @store
   * @operationId createAccount
   * @summary Create a new user account
   * @description Registers a new user and returns an access token.
   * @requestBody <signupValidator>
   * @responseBody 201 - { "success": true, "message": "Account created successfully!", "data": "<AuthStoreData>" }
   * @responseBody 422 - <ApiValidationError>
   */
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { firstName, lastName, email, password } = await request.validateUsing(signupValidator)

    const user = await User.create({ firstName, lastName, email, password })

    const verificationToken = generateVerificationCode()

    const verificationExpiresAt = DateTime.now().plus({ hours: 12 })

    user.emailVerificationToken = verificationToken
    user.emailVerificationTokenExpiresAt = verificationExpiresAt

    await user.save()

    events.UserRegistered.dispatch(user, verificationToken)

    const token = await User.accessTokens.create(user)

    const formattedResponse = ctx.serialize(
      {
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      },
      'Account created successfully!'
    )

    return response.created(formattedResponse)
  }
}
